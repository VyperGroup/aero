// Example: aero with other proxies in a SW switcher design
// Constants
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
importScripts(__uv$config.sw || `${dirToUV}uv.sw.js`);

importScripts(`${dirToAero}/extras/handleWithExtras.js`);

const aeroHandlerWithExtras = patchAeroHandler(handle);
const uv = new UVServiceWorker();

addEventListener("install", skipWaiting);

addEventListener("fetch", event => {
	if (event.request.url.startsWith(location.origin + __uv$config.prefix))
		return event.respondWith(uv.fetch(event));
	if (routeAero(event))
		return event.respondWith(aeroHandlerWithExtras(event));
});
