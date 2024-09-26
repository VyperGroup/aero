// Example: aero with other proxies in a SW switcher design. Includes optional support for the same proxies on the same route.

// Constants
/**
 * @type {string}
 */
const defaultProxy = "aero";
// Either a string or null
/**
 * @type {string | false}
 */
const sharedProxyPath = false;
/**
 * @type {string}
 */
const dirToAero = "/aero/";
/**
 * @type {string}
 */
const dirToUV = "/uv/";

importScripts(`${dirToAero}config.aero.js`);
importScripts(aeroConfig.bundle["bare-mux"]);
importScripts(aeroConfig.bundle.handle);

importScripts(`${dirToUV}uv.bundle.js`);
importScripts(`${dirToUV}uv.config.js`);
importScripts(__uv$config.sw);

importScripts(`${dirToAero}/extras/handleWithExtras.js`);

const aeroHandlerWithExtras = patchAeroHandler(handle);
const uv = new UVServiceWorker();
const dynamic = new Dynamic();
self.dynamic = dynamic;

addEventListener("install", skipWaiting);

// Switching
let chosenProxy = defaultProxy;
addEventListener("message", event => {
	if ("type" in event.data && event.data.type === "changeDefault") {
		const possibleChosenProxy = event.data.data;
		if (isValidProxy(possibleChosenProxy))
			chosenProxy = possibleChosenProxy;
		else {
			console.log(
				`Fatal error: tried to set the default proxy, but the proxy to be set isn't supported: ${chosenProxy}`
			);
		}
	}
});

addEventListener("fetch", ev => {
	if (sharedProxyPath) {
		if (defaultProxy === "aero") {
			return ev.respondWith(aeroHandlerWithExtras(ev));
		}
		if (defaultProxy === "uv") {
			return ev.respondWith(uv.handle(ev));
		}
		if (defaultProxy === "dynamic") {
		}
		let err = `Fatal error: there is no implementation for the default proxy provided: ${defaultProxy}`;
		if (!isValidProxy(defaultProxy)) {
			err = `Fatal error: trying to route to the default proxy, but the default proxy provided is invalid: ${defaultProxy}`;
		}
		console.error(err);
		return ev.respondWith(
			() =>
				new Response(err, {
					status: 500
				})
		);
	}
	if (ev.request.url.startsWith(location.origin + __uv$config.prefix))
		return ev.respondWith(uv.fetch(ev));
	if (routeAero(ev)) return ev.respondWith(aeroHandlerWithExtras(ev));
	// TODO: Include dynamic
	/*
	if (await dynamic.route(event)) {
        return await dynamic.fetch(event);
    }
	*/
});

function isValidProxy(proxy) {
	return ["aero", "uv"].includes(proxy);
}
