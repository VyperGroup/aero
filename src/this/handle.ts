import { Sec } from "$types/index";

import { BareClient } from "@mercuryworkshop/bare-mux";

// Utility
import { afterPrefix } from "$sandbox/shared/getProxyUrl";
import getRequestUrl from "./util/getRequestUrl";
import redir from "./util/redir";
import clear from "$aero/src/this/isolation/execClearEmulationOnWindowClients";
import isHTML from "$sandbox/shared/isHTML";
import getPassthroughParam from "./util/getPassthroughParam";
import escapeJS from "./util/escapeJS";
// Cosmetic
import { AeroLogger } from "$sandbox/shared/Loggers";

// Security
// CORS Emulation
import block from "./isolation/corsTesting";
import HSTSCacheEmulation from "./isolation/HSTSCacheEmulation";
// Integrity check
import integral from "./embeds/integral";
// Cache Emulation
import CacheManager from "$aero/src/this/isolation/CacheManager";

// Rewriters
import rewriteReqHeaders from "$rewriters/reqHeaders";
import rewriteRespHeaders from "$rewriters/respHeaders";
import rewriteCacheManifest from "$rewriters/cacheManifest";
import rewriteManifest from "$rewriters/webAppManifest";

// TODO: Use JSRewriter class instead of rewriteScript
import JSRewriter from "$sandbox/sandboxers/JS/JSRewriter";
import { Config } from "$types/index";

// TODO: Import the aero JS parser config types from aerosandbox into aero's sw typesa
//const jsRewriter = new JSRewriter(self.config.aeroSandbox.jsParserConfig);

// TODO: import init from "./handlers/init";

// Webpack Feature Flags
// biome-ignore lint/style/useSingleVarDeclarator: <explanation>
let FEATURE_CORS_EMULATION: boolean,
	FEATURE_INTEGRITY_EMULATION: boolean,
	FEATURE_ENC_BODY_EMULATION: boolean,
	FEATURE_CACHES_EMULATION: boolean,
	FEATURE_CLEAR_EMULATION: boolean,
	REWRITER_HTML: boolean,
	REWRITER_XSLT: boolean,
	REWRITER_JS: boolean,
	REWRITER_CACHE_MANIFEST: boolean,
	SUPPORT_LEGACY: boolean,
	SUPPORT_WORKER: boolean,
	DEBUG: boolean;

type proxyOrigin = string;
declare const self: WorkerGlobalScope &
	typeof globalThis & {
		config: Config;
		handle;
		logger: AeroLogger;
		bc: BareClient;
		nestedSWs: Map<proxyOrigin, NestedSW[]>;
	};

self.logger = new AeroLogger();
self.bc = new BareClient();

/**
 * Handles the requests
 * @param - The event
 * @returns  The proxified response
 */
// TODO: Move all the proxy middleware code to a bare mixin
async function handle(event: FetchEvent): Promise<Response> {
	let req = event.request;

	// Dynamic config
	// TODO: Dynamically switch backends
	//const { backends /*, wsBackends, wrtcBackends*/ } = getConfig();

	const reqUrl = new URL(req.url);

	const params = reqUrl.searchParams;

	// Don't rewrite the requests for aero's own bundles
	if (self.config.aeroPathFilter(reqUrl.pathname)) {
		const reqOpts: RequestInit = {};
		if (!DEBUG) {
			// Cached to lower the paint time
			reqOpts.headers = {
				"cache-control": "private"
			};
		}
		return await fetch(req.url);
	}

	let isMod;
	const isScript = req.destination === "script";
	if (isScript) {
		const isModParam = getPassthroughParam(params, "isMod");
		isMod = isModParam && isModParam === "true";
	}

	const frameSec = getPassthroughParam(params, "frameSec");

	let clientUrl: URL;
	// Get the origin from the user's window
	if (event.clientId !== "") {
		// Get the current window
		const client = await clients.get(event.clientId);

		if (client)
			// Get the url after the prefix
			clientUrl = new URL(afterPrefix(client.url));
	}

	if (!clientUrl) {
		// TODO: Make a custom fatalErr for SWs that doesn't modify the DOM but returns the error simply instead of overwriting the site with an error site
		return self.logger.fatalErr(
			"No clientUrl found! This means your windows are not accessible to us."
		);
	}

	// Ignore content scripts from extensions
	if (clientUrl.protocol === "chrome-extension:") {
		self.logger.log("Ignoring content script");
	}

	if (!clientUrl.protocol.startsWith("http:")) {
		// TODO: Support custom protocols
		return self.logger.fatalErr(
			`Unknown protocol used: ${clientUrl.protocol}. Full url ${clientUrl.href}`
		);
	}

	/*
	if (self.nestedSWs.size !== 0) {
		// TODO: Implement
		// TODO: Start by checking the proxy origin is the same as the client's proxyOrigin comparing nestedSw.item(n).proxyOrigin to clientUrl.origin
	}
	*/
	// Determine if the request was made to load the homepage; this is needed so that the proxy will know when to rewrite the html files (for example, you wouldn't want it to rewrite a fetch request)
	const isNavigate =
		req.mode === "navigate" && req.destination === "document";

	// This is used for determining the request url
	const isiFrame = req.destination === "iframe";

	// Parse the request url to get the url to proxy
	const proxyUrl = new URL(
		getRequestUrl(
			reqUrl.origin,
			location.origin,
			clientUrl,
			reqUrl.pathname + reqUrl.search,
			isNavigate,
			isiFrame
		)
	);

	// Ensure the request isn't blocked by CORS
	if (FEATURE_CORS_EMULATION && (await block(proxyUrl.href)))
		return new Response("Blocked by CORS", { status: 500 });

	// Log request
	self.logger.log(
		req.destination === ""
			? `${req.method} ${proxyUrl.href}`
			: `${req.method} ${proxyUrl.href} (${req.destination})`
	);

	// Rewrite the request headers
	const reqHeaders = req.headers;

	let sec: Sec;
	if (FEATURE_CACHES_EMULATION) {
		if (proxyUrl.protocol === "http:") {
			const hstsCacheEmulator = new HSTSCacheEmulation(
				reqHeaders.get("strict-transport-security"),
				proxyUrl.origin
			);

			if (await hstsCacheEmulator.redirect()) {
				const redirUrl = proxyUrl;
				redirUrl.protocol = "https:";
				return redir(redirUrl.href);
			}
		}
	}

	if (FEATURE_CORS_EMULATION) {
		if (reqHeaders.has("timing-allow-origin"))
			sec.timing = reqHeaders.get("timing-allow-origin");
		if (reqHeaders.has("permissions-policy"))
			sec.perms = reqHeaders.get("permissions-policy");
		if (reqHeaders.has("x-frame-options"))
			sec.frame = reqHeaders.get("x-frame-options");
		if (reqHeaders.has("content-security-policy"))
			sec.csp = reqHeaders.get("content-security-policy");
	}

	/*
	if (FEATURE_CLEAR_EMULATION && reqHeaders.get("clear-site-data")) {
		sec.clear = JSON.parse(`[${reqHeaders.get("clear-site-data")}]`);
		if ("clear" in sec)
			await clear(sec.clear, await clients.get(event.clientId), proxyUrl);
	} else sec.clear = false;
	*/

	let cache: CacheManager;
	if (FEATURE_CACHES_EMULATION) {
		cache = new CacheManager(reqHeaders);

		if (cache.mode === "only-if-cached")
			// TODO: Emulate network error for your given browser. I would ideally do this through a compile-time macro that fetches the src code of the browsers.
			return new Response("Can't find a cached response", {
				status: 500
			});
	}

	//rewriteReqHeaders(reqHeaders, clientUrl);

	const opts: RequestInit = {
		method: req.method,
		headers: reqHeaders
	};

	// A request body should not be created under these conditions
	if (!["GET", "HEAD"].includes(req.method)) opts.body = req.body;

	// Make the request to the proxy
	const resp = await self.bc.fetch(new URL(req.url).href, {
		method: req.method,
		headers: req.headers
	});

	if (resp instanceof Error)
		return new Response(resp.message, {
			status: 500
		});

	if (FEATURE_CACHES_EMULATION) {
		const cacheAge = cache.getAge(
			reqHeaders.get("cache-control"),
			reqHeaders.get("expires")
		);

		const cachedResp = await cache.get(reqUrl, cacheAge);
		if (cachedResp) return cachedResp;
	}

	// Rewrite the response headers
	//const rewroteRespHeaders = rewriteRespHeaders(resp.headers, clientUrl);

	// Overwrite the response headers (they are immutable)
	/*
	Object.defineProperty(resp, "headers", {
		value: rewroteRespHeaders,
		configurable: false
	});
	*/

	const type = resp.headers.get("content-type");

	// For modules
	const isModWorker =
		new URLSearchParams(location.search).get("isMod") === "true";

	const html =
		// Not all sites respond with a type
		typeof type === "undefined" || isHTML(type);
	/** @type {string | ReadableStream} */
	let body: string;
	// Rewrite the body
	// TODO: Pack these injected scripts with Webpack
	if (REWRITER_HTML && isNavigate && html) {
		body = await resp.text();

		// TODO: Eliminate _IMPORT_ recursion somehow
		if (body !== "") {
			const base = /* html */ `
<!DOCTYPE html>
<head>
    <!-- Fix encoding issue -->
    <meta charset="utf-8">

    <!-- Favicon -->
    <!--
    Delete favicon if /favicon.ico isn't found
    This is needed because the browser caches the favicon from the previous site
    -->
    <link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=" rel="icon" type="image/x-icon">
    <!-- If not defined already, manually set the favicon -->
    <link href="/favicon.ico" rel="icon" type="image/x-icon">

    <script>
		{
			// Aero's global proxy namespace
			// The only things defined in here at this time are what is needed to be passed through the SW context to the client context. The rest is defined in the client when the aero bundle for the client is loaded.
			window.$aero = {
				// Security
				sec:  { ...sec, ...${JSON.stringify(sec)} },
				// This is used to later copy into an iFrame's srcdoc; this is for an edge case
				init: \`_IMPORT_\`,
				prefix: ${self.config.prefix}
			};
		}
		delete window.sec;
    </script>
	<script src="${self.config.bundles.sandbox}">
</head>
`;

			// Recursion
			body = base.replace(/_IMPORT_/, escapeJS(base)) + body;
		}
	} else if (
		REWRITER_XSLT &&
		isNavigate &&
		(type.startsWith("text/xml") || type.startsWith("application/xml"))
	) {
		body = await resp.text();

		// TODO: Update this to support modern aero
		/*
		xml body = `
<config>
{
	prefix: ${prefix}
}
</config>
<?xml-stylesheet type="text/xsl" href="/aero/browser/xml/intercept.xsl"?>
${body}
		`;
		*/
		// @ts-ignore
	} /*else if (REWRITER_JS && isScript) {
		const script = await resp.text();

		if (FEATURE_INTEGRITY_EMULATION) {
			body = jsRewriter.wrapScript(script, {
				isModule: isMod,
				insertCode: /* js *\/ `
  {
	const bak = decodeURIComponent(escape(atob(\`${escapeJS(script)}\`)));
	${integral(isMod)}
  }
  `
			});
			// @ts-ignore
		} else
			body = jsRewriter.wrapScript(script, {
				isModule: isMod
			});

	} */ else if (REWRITER_CACHE_MANIFEST && req.destination === "manifest") {
		let body = await resp.text();

		// Safari exclusive
		if (SUPPORT_LEGACY && type.includes("text/cache-manifest")) {
			const isFirefox = reqHeaders["user-agent"].includes("Firefox");

			body = rewriteCacheManifest(body, isFirefox);
		} else body = rewriteManifest(body, proxyUrl);
	} // TODO: Bring back worker support in aero
	/*else if (SUPPORT_WORKER && req.destination === "worker")
		body = isModWorker
			? /* js *\/ `
import { proxyLocation } from "${aeroPrefix}worker/worker";
self.location = proxyLocation;
`
			: `
importScripts("${aeroPrefix}worker/worker.js");

${body}
		`;
	else if (SUPPORT_WORKER && req.destination === "sharedworker")
		body = isModWorker
			? /* js *\/ `
import { proxyLocation } from "${aeroPrefix}worker/worker";
self.location = proxyLocation;
`
			: /* js *\/ `
importScripts("${aeroPrefix}worker/worker.js");
importScripts("${aeroPrefix}worker/sharedworker.js");

${body}
		`;
	*/
	// No rewrites are needed; proceed as normal
	else body = resp.body;

	if (FEATURE_ENC_BODY_EMULATION) {
		// FIXME: Fix whatever this is. I forgot where I was going with this.
		resp.headers["x-aero-size-transfer"] = null;
		resp.headers["x-aero-size-encbody"] = null;

		// TODO: x-aero-size-transfer
		if (typeof body === "string") {
			resp.headers["x-aero-size-body"] = new TextEncoder().encode(
				body
			).length;
			// TODO: Emulate x-aero-size-encbody
		} else if (body instanceof ArrayBuffer) {
			resp.headers["x-aero-size-body"] = body.byteLength;
			// TODO: Emulate x-aero-size-encbody
		}
	}

	resp.body = resp.status === 204 ? null : body;

	if (FEATURE_CACHES_EMULATION) {
		// Cache the response
		cache.set(reqUrl.href, resp, resp.headers.get("vary"));
	}

	// Return the response
	return resp;
}

self.handle = handle;
