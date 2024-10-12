import { type FeatureFlagsRspack } from "./types/featureFlags";
import type { BareMux } from "@mercuryworkshop/bare-mux";
import type { Sec } from "$aero/types";

// Utility
import { afterPrefix } from "$sandbox/shared/getProxyUrl";
import appendSearchParam from "../AeroSandbox/src/shared/appendSearchParam"; // TODO: $shared
import getPassthroughParam from "./util/getPassthroughParam";
import getRequestUrl from "./util/getRequestUrl";
import redir from "./util/redir";
// TODO: Fix import - import clear from "./isolation/execClearEmulationOnWindowClients";
import isHTML from "$sandbox/shared/isHTML";
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
import type { Config } from "$aero/types/config";

// TODO: Import the aero JS parser config types from aerosandbox into aero's sw types
//const jsRewriter = new JSRewriter(self.config.aeroSandbox.jsParserConfig);

// TODO: import init from "./handlers/init";

// Webpack Feature Flags
// biome-ignore lint/style/useSingleVarDeclarator: <explanation>
let SERVER_ONLY: string,
	REQ_INTERCEPTION_CATCH_ALL: string,
	FEATURE_CORS_EMULATION: boolean,
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
	AERO_BRANDING_IN_PROD: boolean,
	DEBUG: boolean;

type proxyOrigin = string;
declare const self: WorkerGlobalScope &
	typeof globalThis & {
		config: Config;
		aeroConfig: Config;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		BareMux: BareMux;
		handle;
		logger: AeroLogger;
		nestedSWs: Map<proxyOrigin, NestedSW[]>;
	};

self.logger = new AeroLogger();
self.config = aeroConfig;

/**
 * Handles the requests
 * @param - The event
 * @returns  The proxified response
 */
// TODO: Move all the proxy middleware code to a bare mixin
async function handle(event: FetchEvent): Promise<Response> {
	// Ensure that everything has been initalized properly
	if (!("logger" in self))
		throw new Error("The logger hasn't been initalized!");
	if (!("aeroConfig" in self))
		throw self.logger.fatalErr("The is no config provided");
	/** The feature flags that are expected to be used in this SW handler */
	const expectedFeatureFlags /*: keyof FeatureFlagsRspack*/ = [
		"REWRITER_HTML"
	]; // TODO: Add them all
	let missingFeatureFlags /*: keyof FeatureFlagsRspack*/ = [];
	/*
	for (const expectedFeatureFlag of expectedFeatureFlags)
		if (!(expectedFeatureFlag in self))
			missingFeatureFlags.push(expectedFeatureFlag);
	if (missingFeatureFlags.length > 0)
		throw self.logger.fatalErr(`The expected feature flags required in this sw were not found: ${JSON.stringify(missingFeatureFlags)}`);
	*/
	const req = event.request;

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

	let isMod: boolean;
	const isScript = req.destination === "script";
	if (isScript) {
		const isModParam = getPassthroughParam(params, "isMod");
		isMod = isModParam && isModParam === "true";
	}

	const frameSec = getPassthroughParam(params, "frameSec");

	console.log(REQ_INTERCEPTION_CATCH_ALL);

	let clientURL: URL;
	// Get the origin from the user's window
	if (REQ_INTERCEPTION_CATCH_ALL === "clients" && event.clientId !== "") {
		if (SERVER_ONLY) {
			throw self.logger.fatalErr(
				'The Feature Flag "REQ_INTERCEPTION_CATCH_ALL" can\'t be set to "clients" when "SERVER_ONLY" is enabled.'
			);
		}
		// Get the current window
		const client = await clients.get(event.clientId);
		if (client)
			// Get the url after the prefix
			clientURL = new URL(afterPrefix(client.url));
	} else if (REQ_INTERCEPTION_CATCH_ALL === "referrer") {
		const referrerPolicy = req.headers["referrer-policy"];
		if (referrerPolicy)
			appendSearchParam(
				params,
				self.config.searchParamOptions.referrerPolicy,
				referrerPolicy
			);
	} else {
		self.logger.fatalErr(
			"No catch-all interception types found and rewrite-url is currently unsupported."
		);
	}

	// Determine if the request was made to load the homepage; this is needed so that the proxy will know when to rewrite the html files (for example, you wouldn't want it to rewrite a fetch request)
	const isNavigate =
		req.mode === "navigate" && req.destination === "document";

	if (!isNavigate && !clientURL) {
		// TODO: Make a custom fatalErr for SWs that doesn't modify the DOM but returns the error simply instead of overwriting the site with an error site
		throw self.logger.fatalErr(
			"No clientUrl found on a request to a resource! This means your windows are not accessible to us."
		);
		// biome-ignore lint/style/noUselessElse: <explanation>
	} else if (clientURL) {
		// Ignore content scripts from extensions
		if (clientURL.protocol === "chrome-extension:")
			self.logger.log("Ignoring content script");
		// Ignore view source
		if (clientURL.protocol === "view-source:")
			self.logger.log("Ignoring view source");
		if (!clientURL.protocol.startsWith("http")) {
			// TODO: Support custom protocols
			throw self.logger.fatalErr(
				`Unknown protocol used: ${clientURL.protocol}. Full url ${clientURL.href}`
			);
		}
	}

	/*
	if (self.nestedSWs.size !== 0) {
		// TODO: Implement
		// TODO: Start by checking the proxy origin is the same as the client's proxyOrigin comparing nestedSw.item(n).proxyOrigin to clientUrl.origin
	}
	*/

	// This is used for determining the request url
	const isiFrame = req.destination === "iframe";

	// Parse the request url to get the url to proxy
	const proxyUrl = new URL(
		getRequestUrl(
			reqUrl.origin,
			location.origin,
			clientURL,
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
	const rewrittenReqHeaders = req.headers;

	let sec: Sec;
	if (FEATURE_CACHES_EMULATION) {
		if (proxyUrl.protocol === "http:") {
			const hstsCacheEmulator = new HSTSCacheEmulation(
				rewrittenReqHeaders.get("strict-transport-security"),
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
		if (rewrittenReqHeaders.has("timing-allow-origin"))
			sec.timing = rewrittenReqHeaders.get("timing-allow-origin");
		if (rewrittenReqHeaders.has("permissions-policy"))
			sec.perms = rewrittenReqHeaders.get("permissions-policy");
		if (rewrittenReqHeaders.has("x-frame-options"))
			sec.frame = rewrittenReqHeaders.get("x-frame-options");
		if (rewrittenReqHeaders.has("content-security-policy"))
			sec.csp = rewrittenReqHeaders.get("content-security-policy");
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
		cache = new CacheManager(rewrittenReqHeaders);

		if (cache.mode === "only-if-cached")
			// TODO: Emulate network error for your given browser. I would ideally do this through a compile-time macro that fetches the src code of the browsers.
			return new Response("Can't find a cached response", {
				status: 500
			});
	}

	//rewriteReqHeaders(reqHeaders, clientUrl);

	const rewrittenReqOpts: RequestInit = {
		method: req.method,
		headers: rewrittenReqHeaders
	};

	// A request body should not be created under these conditions
	if (!["GET", "HEAD"].includes(req.method)) rewrittenReqOpts.body = req.body;

	// Make the request to the proxy
	const resp = await (new BareMux.BareClient).fetch(
		new URL(proxyUrl).href,
		rewrittenReqOpts
	);

	if (!resp) self.logger.fatalErr("No response found!");
	if (resp instanceof Error) throw Error;

	if (FEATURE_CACHES_EMULATION) {
		const cacheAge = cache.getAge(
			rewrittenReqHeaders.get("cache-control"),
			rewrittenReqHeaders.get("expires")
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

	let rewrittenBody: string | ReadableStream;
	// Rewrite the body
	// TODO: Pack these injected scripts with Webpack
	if (REWRITER_HTML && isNavigate && html) {
		const body = await resp.text();
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
				sec:  { ${sec ? `...${JSON.stringify(sec)}` : ""} },
				// This is used to later copy into an iFrame's srcdoc; this is for an edge case
				init: \`_IMPORT_\`,
				prefix: ${self.config.prefix},
				searchParamOptions: ${JSON.stringify(
					self.config.searchParamOptions
				)},
			};
		}
    </script>
    <!-- TODO: Make a logger bundle just for the client, which registers on whatever object is provided by \`$aero.sandbox.config.loggerNamespace\`, for example, with the default config it would register to \`$aero.logger\` -->
    <script src="${self.config.bundles.loggerClient}"></script>
	<script type="module">
		if (!(AeroSandbox in self)) {
			//TODO: Make this method do a crash string
			$aero.logger.fatalErr("Missing the AeroSandbox declaration after importing the AeroSandbox bundle")
		}
		import aeroSandboxConfig from "${aeroConfig.bundles.aeroSandboxConfig}";
		const aeroSandbox new AeroSandbox(aeroSandboxConfig);
		aeroSandbox.registerStorageIsolators("$aero") // takes in the storage key prefix you want
		${DEBUG || AERO_BRANDING_IN_PROD ? `$aero.logger.image(${aeroConfig.bundles.logo})` : ""}
		$aero.logger("AeroSandbox has been loaded and initialized: aero is ready to go!");
	</script>
</head>
`;

			// Recursion
			rewrittenBody = base.replace(/_IMPORT_/, escapeJS(base)) + body;
		}
	} else if (
		REWRITER_XSLT &&
		isNavigate &&
		(type.startsWith("text/xml") || type.startsWith("application/xml"))
	) {
		const body = await resp.text();
		rewrittenBody = body;

		// TODO: Update this to support modern aero
		/*
		xml rewrittenBody = `
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
		const body = await resp.text();

		// Safari exclusive
		if (SUPPORT_LEGACY && type.includes("text/cache-manifest")) {
			const isFirefox =
				rewrittenReqHeaders["user-agent"].includes("Firefox");

			rewrittenBody = rewriteCacheManifest(body, isFirefox);
		} else rewrittenBody = rewriteManifest(body, proxyUrl);
	} // TODO: Bring back worker support in aero
	/*else if (SUPPORT_WORKER && req.destination === "worker") {
		rewrittenBody = isModWorker
			? /* js *\/ `
import { proxyLocation } from "${prefix}worker/worker";
import { FeatureFlags } from '../featureFlags';
self.location = proxyLocation;
`
			: `
importScripts("${prefix}worker/worker.js");

${body}
		`;
	else if (SUPPORT_WORKER && req.destination === "sharedworker")
		body = isModWorker
			? /* js *\/ `
import { proxyLocation } from "${prefix}worker/worker";
self.location = proxyLocation;
`
			: /* js *\/ `
importScripts("${prefix}worker/worker.js");
importScripts("${prefix}worker/sharedworker.js");

${body}
		`;
	*/
	// No rewrites are needed; proceed as normal
	else rewrittenBody = resp.body;

	if (FEATURE_ENC_BODY_EMULATION) {
		// FIXME: Fix whatever this is. I forgot where I was going with this.
		resp.headers["x-aero-size-transfer"] = null;
		resp.headers["x-aero-size-encbody"] = null;

		// TODO: x-aero-size-transfer
		if (typeof rewrittenBody === "string") {
			resp.headers["x-aero-size-body"] = new TextEncoder().encode(
				rewrittenBody
			).length;
			// TODO: Emulate x-aero-size-encbody
		} else if (rewrittenBody instanceof ArrayBuffer) {
			resp.headers["x-aero-size-body"] = rewrittenBody.byteLength;
			// TODO: Emulate x-aero-size-encbody
		}
	}

	if (FEATURE_CACHES_EMULATION)
		// Cache the response
		cache.set(reqUrl.href, resp, resp.headers.get("vary"));

	// Return the response
	return new Response(resp.status === 204 ? null : rewrittenBody, {
		headers: resp.headers,
		status: resp.status
	});
}

self.aeroHandle = handle;
self.routeAero = (event: FetchEvent): boolean => {
	return event.request.url.startsWith(location.origin + aeroConfig.prefix);
};
