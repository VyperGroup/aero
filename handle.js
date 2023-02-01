// Routes
import routes from "./routes.js";

// Dynamic Config
import getConfig from "./this/dynamic/getConfig.js";

// Utility
import ProxyFetch from "./this/misc/ProxyFetch.js";
import sharedModule from "./this/misc/sharedModule.js";
import getRequestUrl from "./this/misc/getRequestUrl.js";
import headersToObject from "./this/misc/headersToObject.js";
import unwrapImports from "./this/misc/unwrapImports.js";

// Cors Emulation
import block from "./this/misc/corsTest.js";

// Rewriters
import rewriteReqHeaders from "./this/rewriters/reqHeaders.js";
import rewriteRespHeaders from "./this/rewriters/respHeaders.js";
import rewriteManifest from "./this/rewriters/manifest.js";
import scope from "./shared/scope.js";

/**
 * Handles the requests
 * @param {FetchEvent} - The event
 * @returns {Response} - The proxified response
 */
async function handle(event) {
	// Dynamic config
	const { aeroPrefix, proxyApi, proxyApiWs, prefix, debug, flags } =
		getConfig();

	// Separate the prefix from the url to get the proxy url isolated
	const afterPrefix = url =>
		url.replace(new RegExp(`^(${self.location.origin}${prefix})`, "g"), "");

	// Construct proxy fetch instance
	const proxyFetch = new ProxyFetch(self.location.origin + proxyApi);

	const req = event.request;

	const reqUrl = new URL(req.url);

	const path = reqUrl.pathname + reqUrl.search;

	// Remove the module components
	if (path.startsWith(aeroPrefix + "shared/") && path.endsWith(".js"))
		return await sharedModule(event);
	// Don't rewrite requests for aero library files
	if (path.startsWith(aeroPrefix))
		// Proceed with the request like normal
		return await fetch(req.url);

	var proxyUrl;
	// Get the origin from the user's window
	if (event.clientId !== "") {
		// Get the current window
		const win = await clients.get(event.clientId);

		// Get the url after the prefix
		proxyUrl = new URL(afterPrefix(win.url));
	}

	// Determine if the request was made to load the homepage; this is needed so that the proxy will know when to rewrite the html files (for example, you wouldn't want it to rewrite a fetch request)
	const homepage = req.mode === "navigate" && req.destination === "document";
	// This is used for determining the request url and
	const iFrame = req.destination === "iframe";

	// Parse the request url to get the url to proxy
	const url = getRequestUrl(
		prefix,
		reqUrl.origin,
		self.location.origin,
		proxyUrl,
		path,
		homepage,
		iFrame
	);

	// Ensure the request isn't blocked by CORS
	if (flags.corsEmulation && (await block(url.href)))
		return new Response("Blocked by CORS", { status: 500 });

	// Log requests
	if (debug.url)
		console.log(
			req.destination == ""
				? `${req.method} ${url}`
				: `${req.method} ${url} (${req.destination})`
		);

	// Rewrite the request headers
	const reqHeaders = headersToObject(req.headers);
	const rewrittenReqHeaders = rewriteReqHeaders(
		prefix,
		reqHeaders,
		proxyUrl,
		afterPrefix
	);

	let opts = {
		method: req.method,
		headers: rewrittenReqHeaders,
	};

	// A request body should only be created under a post request
	if (req.method === "POST") opts.body = await req.text();

	// Make the request to the proxy
	const resp = await proxyFetch.fetch(url, opts);

	// Rewrite the response headers
	const respHeaders = headersToObject(resp.headers);
	const rewrittenRespHeaders = rewriteRespHeaders(
		prefix,
		flags.corsEmulation,
		respHeaders
	);

	const type = respHeaders["content-type"];

	const html =
		// Not all sites respond with a type
		typeof type === "undefined" || type.startsWith("text/html");

	// Rewrite the body
	let body;
	// For modules
	const isMod = new URLSearchParams(location.search).mod === "true";
	if ((homepage || iFrame) && html) {
		body = await resp.text();

		if (body !== "") {
			body = `
			<!DOCTYPE html>
			<head>
				<!-- Fix encoding issue -->
				<meta charset="utf-8">
				
				<!-- Favicon -->
				<!--
				Delete favicon if /favicon.ico isn't found
				This is needed because the browser will cache the favicon from the previous site
				-->
				<link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=" rel="icon" type="image/x-icon">
				<!-- If not defined already, manually set the favicon -->
				<link href="${prefix + url.origin}/favicon.ico" rel="icon" type="image/x-icon">
				
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
						.catch(err => console.error(err.message));

					// Aero's global namespace
					var $aero = {
						config: {
							aeroPrefix: ${aeroPrefix},
							prefix: "${prefix}",
							proxyApiWs: "${proxyApiWs}",
							debug: ${JSON.stringify(debug)},
							flags: ${JSON.stringify(flags)},
						}
					};

					$aero.afterPrefix = url => url.replace(new RegExp(\`^(\${location.origin}\${$aero.config.prefix})\`, "g"), ""); 
				</script>

				<!-- Injected Aero code -->
				${unwrapImports(aeroPrefix, routes)}
				<script>
					// This is used to later copy into an iFrame's srcdoc; this is an edge case
					$aero.imports = \`${unwrapImports(aeroPrefix, routes, true)}\`;
				</script>
				</head>
				
				${body}
			`;
		}
	} else if (req.destination === "script")
		// Scope the scripts
		body = scope(flags.advancedScoping, debug.scoping, await resp.text());
	else if (req.destination === "manifest") {
		// Safari exclusive
		if (flags.legacy && type.contains("text/cache-manifest"))
			body = rewriteCacheManifest();
		body = rewriteManifest(prefix, await resp.text());
	}
	// Nests
	else if (flags.nestedWorkers && req.destination === "worker")
		body = isMod
			? `
import { proxyLocation } from "${aeroPrefix}workerApis/worker.js";
self.location = proxyLocation;
`
			: `
importScripts("${aeroPrefix}nest/worker.js");

${body}
		`;
	else if (flags.nestedWorkers && req.destination === "sharedworker")
		body = isMod
			? `
import { proxyLocation } from "${aeroPrefix}workerApis/worker.js";
self.location = proxyLocation;
`
			: `
importScripts("${aeroPrefix}workerApis/worker.js");
importScripts("${aeroPrefix}workerApis/sharedworker.js");
	
${body}
		`;
	else if (flags.nestedWorkers && req.destination === "serviceworker")
		body = isMod
			? `
import { proxyLocation } from "${aeroPrefix}workerApis/worker.js";
self.location = proxyLocation;
`
			: `
importScripts("${aeroPrefix}workerApis/worker.js");
importScripts("${aeroPrefix}workerApis/sw.js");

${body}
		`;
	// No rewrites are needed; proceed as normal
	else body = resp.body;

	// Return the response
	return new Response(body, {
		status: resp.status ? resp.status : 200,
		headers: rewrittenRespHeaders,
	});
}

export default handle;
