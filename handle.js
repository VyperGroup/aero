// Routes
import routes from "./this/internal/routes.js";

// Dynamic Config
import getConfig from "./this/dynamic/getConfig.js";
// Standard Config
import { prefix, aeroPrefix, agLists, flags, debug } from "./config.js";

// Utility
import BareClient from "./this/misc/bare/dist/BareClient.js";
import ProxyFetch from "./this/misc/ProxyFetch.js";
import sharedModule from "./this/misc/sharedModule.js";
import getRequestUrl from "./this/misc/getRequestUrl.js";
import headersToObject from "./this/misc/headersToObject.js";
import isHtml from "./shared/isHtml.js";
import { unwrapImport, unwrapImports } from "./this/misc/unwrapImports.js";

// Security
// CORS Emulation
import block from "./this/cors/test.js";
import STS from "./this/cors/STS.js";
// Integrity check
import integral from "./this/embeds/integral.js";

// Cache Emulation
import CacheManager from "./this/cors/CacheManager.js";

// Rewriters
import rewriteReqHeaders from "./this/rewriters/reqHeaders.js";
import rewriteRespHeaders from "./this/rewriters/respHeaders.js";
import rewriteCacheManifest from "./this/rewriters/cacheManifest.js";
import rewriteManifest from "./this/rewriters/manifest.js";
import rewriteScript from "./shared/script.js";

// Libs
// TODO: Compile a bundle for SWs
/*
import * as ag from "https://cdn.jsdelivr.net/npm/@adguard/tsurlfilter/+esm";
const agE = new ag.Engine(
	...agLists.map(
		list =>
			new ag.RuleStorage([new ag.StringRuleList("0", list, false, false)])
	)
);
const agRedir = new ag.RedirectsService();
await agRedir.init();
*/

// RegExps
// FIXME: Breaks often
//const escapeJS = str => str.replace(/`/g, String.raw`\``).replace(/\${/g, String.raw`\${`).replace(/<\/script>/g, String.raw`<\/script>`);
const escapeJS = str => btoa(unescape(encodeURIComponent(str)));

/**
 * Handles the requests
 * @param {FetchEvent} - The event
 * @returns {Response} - The proxified response
 */
async function handle(event) {
	const req = event.request;

	// Dynamic config
	const { backends, wsBackends, wrtcBackends } = getConfig();

	// Separate the prefix from the url to get the proxy url isolated
	const afterPrefix = url =>
		url.replace(new RegExp(`^(${location.origin}${prefix})`, "g"), "");

	const useBare = BareClient && typeof BareClient === "function";

	// Construct proxy fetch instance
	const proxyFetch = useBare
		? // The bare client doesn't support proxy switching
		  new BareClient(backends[0])
		: new ProxyFetch(backends);

	const reqUrl = new URL(req.url);

	const params = reqUrl.searchParams;

	function getPassthroughParam(param) {
		param = params.get(param);

		if (param) {
			params.getAll(`_${param}`).forEach(v => params.append(param, v));
			params.delete(`_${param}`);
		}

		return param;
	}

	// Remove the module components
	if (
		reqUrl.pathname.startsWith(aeroPrefix + "shared/") &&
		reqUrl.pathname.endsWith(".js")
	)
		return await sharedModule(event);
	// Don't rewrite requests for aero library files
	if (reqUrl.pathname.startsWith(aeroPrefix))
		// Proceed with the request like normal
		return await fetch(req.url);

	let isMod;
	const isScript = req.destination === "script";
	if (isScript) {
		isMod = getPassthroughParam("isMod") === "true";
	}

	let frameSec = getPassthroughParam("frameSec");

	var clientUrl;
	// Get the origin from the user's window
	if (event.clientId !== "") {
		// Get the current window
		const client = await clients.get(event.clientId);

		// Get the url after the prefix
		clientUrl = new URL(afterPrefix(client.url));
	}

	// Determine if the request was made to load the homepage; this is needed so that the proxy will know when to rewrite the html files (for example, you wouldn't want it to rewrite a fetch request)
	const isHomepage =
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
			isHomepage,
			isiFrame
		)
	);

	// AdGuard
	/*
	let agReq;
	if (agLists.length > 0) {
		agReq = new ag.Request(
			proxyUrl.href,
			null,
			agE.RequestType.find(
				type => type.toLowerCase() === req.destination
			) ?? "Document"
		);
		const res = agE.matchRequest(agReq);
		const blocked = res.basicRule && !res.basicRule.isAllowlist();
		if (blocked)
			return new Response("Blocked by AdGuard", {
				status: 500,
			});

		if (res.isOptionEnabled(ag.NetworkRuleOption.Redirect))
			return redir(
				agRedir.createRedirectUrl(
					res.getBasicResult().getAdvancedModifierValue()
				)
			);

		// TODO: Cookie filtering
	}
	*/

	// Ensure the request isn't blocked by CORS
	if (flags.corsEmulation && (await block(proxyUrl.href)))
		return new Response("Blocked by CORS", { status: 500 });

	// Log requests
	if (debug.url)
		console.debug(
			req.destination == ""
				? `${req.method} ${proxyUrl.href}`
				: `${req.method} ${proxyUrl.href} (${req.destination})`
		);

	// Rewrite the request headers
	const reqHeaders = headersToObject(req.headers);

	const isNavigate = isHomepage || isiFrame;

	// Bing AI on all browsers
	if (isNavigate && proxyUrl.origin === "https://www.bing.com") {
		const ua = reqHeaders["user-agent"];

		if (!/EdgA?\//.test(ua))
			reqHeaders["user-agent"] +=
				(ua.contains("Mobile") ? "Edg/" : "EdgA/") + "0.0";
	}

	let sec = {};
	if (flags.corsEmulation) {
		// FIXME:
		/*
		if (proxyUrl.protocol === "http:") {
			const sts = new STS(
				reqHeaders["strict-transport-security"],
				proxyUrl.origin
			);

			if (await sts.redirect()) {
				const redirUrl = proxyUrl;

				redirUrl.protocol = "https:";

				return redir(redirUrl);
			}
		}
		*/

		sec = {
			clear: reqHeaders["clear-site-data"]
				? JSON.parse(`[${reqHeaders["clear-site-data"]}]`)
				: undefined,
			// TODO: Emulate
			timing: reqHeaders["timing-allow-origin"],
			permsFrame: frameSec?.["perms"],
			perms: reqHeaders["permissions-policy"],
			// These are parsed later in frame.js if needed
			frame: reqHeaders["x-frame-options"],
			// This is only used for getting the frame frameancesors for $aero.frame
			csp: reqHeaders["content-security-policy"],
		};

		if (sec.clear) await clear(sec.clear, event.clientId);
	}

	// Cache mode emulation
	const cache = new CacheManager(reqHeaders);

	if (cache.mode === "only-if-cached")
		// TODO: Emulate network error
		return new Response("Can't find a cached response", {
			status: 500,
		});

	let opts = {
		method: req.method,
		headers: rewriteReqHeaders(reqHeaders, clientUrl, afterPrefix),
	};

	// A request body should only be created under a post request
	if (req.method === "POST") opts.body = await req.text();

	// Make the request to the proxy
	const resp = await proxyFetch.fetch(proxyUrl.href, opts);

	if (resp instanceof Error)
		return new Response(resp, {
			status: 500,
		});

	// Rewrite the response headers
	const respHeaders = headersToObject(resp.headers);

	const cacheAge = cache.getAge(
		reqHeaders["cache-control"],
		reqHeaders["expires"]
	);

	const cachedResp = await cache.get(reqUrl, cacheAge, respHeaders["vary"]);

	if (cachedResp) return cachedResp;

	const rewrittenRespHeaders = rewriteRespHeaders(respHeaders);

	const type = respHeaders["content-type"];

	const html =
		// Not all sites respond with a type
		typeof type === "undefined" || isHtml(type);

	/** @type {string | ReadableStream} */
	let body;

	// For modules
	const isModWorker =
		new URLSearchParams(location.search).get("isMod") === "true";

	// Rewrite the body
	if (isNavigate && html) {
		body = await resp.text();

		let agHide = "";
		let agHideScript = "";
		/*
		if (agReq) {
			const cosRes = agE.getCosmeticResult(
				agReq,
				ag.CosmeticOption.CosmeticOptionAll
			);
			agHide += (
				[
					...cosRes.elementHiding.generic,
					...cosRes.elementHiding.specific,
				].join(", ") + "{ display: none!important; }"
			).join("\n\n");

			agHideScript = cosmeticResult
				.getScriptRules()
				.map(rule => rule.getScript())
				.join("\r\n");
		}
		*/

		if (body !== "") {
			let base = `
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

	<!-- Third party libs -->
	${useBare ? unwrapImport("this/misc/dist/BareClient.cjs") : ""}

    <script>
        // Update the service worker
        navigator.serviceWorker
            .register("/sw.js", {
                scope: ${prefix},
                // Don't cache http requests
                updateViaCache: "none",
                type: "module",
            })
            // Update service worker
            .then(reg => reg.update())
            .catch(err => console.error);

		if (!window.sec)
			window.sec = {};

        // Aero's global namespace
        var $aero = {
			config: {
				prefix: "${prefix}",
				aeroPrefix: "${aeroPrefix}",
				wsBackends: ${JSON.stringify(wsBackends)},
				wrtcBackends: ${JSON.stringify(wrtcBackends)},
				debug: ${JSON.stringify(debug)},
				flags: ${JSON.stringify(flags)},
			},
			useBare: ${useBare},
			// Security
			sec:  { ...sec, ...${JSON.stringify(sec)} },
			// This is used to later copy into an iFrame's srcdoc; this is for an edge case
			init: \`_IMPORT_\`,
			afterPrefix: url => url.replace(new RegExp(\`^(\${location.origin}\${$aero.config.prefix})\`, "g"), ""),
			afterOrigin: url => url.replace(new RegExp(\`^(\${location.origin})\`, "g"), "")
		};
		delete window.sec;
		Object.freeze($aero.config);
    </script>
	<script>
		// Sanity check
		if (!("$aero" in window))
			console.warn("Unable to initalize $aero");
	</script>

    <!-- The src rewriter needs proxyLocation early -->
	${unwrapImport("browser/misc/proxyLocation")}
	<!-- Injected Aero code -->
    ${unwrapImports(routes)}
	<script>
		// Protect from overwriting, in case $aero scoping failed
		Object.freeze($aero);
	</script>
	${unwrapImport("browser/injects/dom")}

	<!-- AdGuard cosmetic filters -->
	<style>
	${agHide}
	</style>
	<script>
	${agHideScript}
	</script>
</head>
`;
			// Recursion
			body = base.replace(/_IMPORT_/, escapeJS(base)) + body;
		}
	} else if (
		isNavigate &&
		(type.startsWith("text/xml") || type.startsWith("application/xml"))
	) {
		body = await resp.text();

		`
<config>
{
	prefix: ${prefix}
}
</config>
<?xml-stylesheet type="text/xsl" href="/aero/browser/xml/intercept.xsl"?>
${body}
		`;
	} else if (isScript) {
		const script = await resp.text();

		if (flags.corsEmulation) {
			body = rewriteScript(
				script,
				isMod,
				`
{
	const bak = decodeURIComponent(escape(atob(\`${escapeJS(script)}\`)));
	${integral(isMod)}
}			
`
			);
		} else body = rewriteScript(script, isMod);
	} else if (req.destination === "manifest") {
		// Safari exclusive
		if (flags.legacy && type.includes("text/cache-manifest")) {
			const isFirefox = reqHeaders["user-agent"].includes("Firefox");

			body = rewriteCacheManifest(isFirefox);
		} else body = rewriteManifest(await resp.text());
	}
	// Nests
	else if (flags.workers && req.destination === "worker")
		body = isModWorker
			? `
import { proxyLocation } from "${aeroPrefix}worker/worker.js";
self.location = proxyLocation;
`
			: `
importScripts("${aeroPrefix}worker/worker.js");

${body}
		`;
	else if (flags.workers && req.destination === "sharedworker")
		body = isModWorker
			? `
import { proxyLocation } from "${aeroPrefix}worker/worker.js";
self.location = proxyLocation;
`
			: `
importScripts("${aeroPrefix}worker/worker.js");
importScripts("${aeroPrefix}worker/sharedworker.js");
	
${body}
		`;
	else if (flags.workers && req.destination === "serviceworker")
		body = isModWorker
			? `
import { proxyLocation } from "${aeroPrefix}workerApis/worker.js";
self.location = proxyLocation;
`
			: `
importScripts("${aeroPrefix}worker/worker.js");
importScripts("${aeroPrefix}worker/sw.js");

${body}
		`;
	// No rewrites are needed; proceed as normal
	else body = resp.body;

	rewriteRespHeaders["x-aero-size-transfer"] = null;
	rewriteRespHeaders["x-aero-size-encbody"] = null;

	// TODO: x-aero-size-transfer
	if (typeof body === "string") {
		rewriteRespHeaders["x-aero-size-body"] = new TextEncoder().encode(
			body
		).length;
		// TODO: x-aero-size-encbody
	} else if (typeof body === "ArrayBuffer") {
		rewriteRespHeaders["x-aero-size-body"] = body.byteLength;
		// TODO: x-aero-size-encbody
	}

	const proxyResp = new Response(resp.status === 204 ? null : body, {
		status: resp.status ?? 200,
		headers: rewrittenRespHeaders,
	});

	// Cache the response
	cache.set(reqUrl, proxyResp.clone());

	// Return the response
	return proxyResp;
}

export default handle;
