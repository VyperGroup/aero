// Example: aero with other proxies in a SW switcher design

// Constants
/**
 * @type {string}
 */
const pathToPatchedAerohandler = "./aeroHandleSimple.js";
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
const dirToAeroConfig = "/aero/";
/**
 * @type {string}
 */
const dirToUvConfigAndBundle = "/uv/";

importScripts(`${dirToAeroConfig}config.aero.js`);
importScripts(aeroConfig.bundle.handle);

importScripts(`${dirToUvConfigAndBundle}uv.bundle.js`);
importScripts(`${dirToUvConfigAndBundle}uv.config.js`);
importScripts(__uv$config.sw);

importScripts(pathToPatchedAerohandler);

const aeroHandler = patchAeroHandler(handle);
const uv = new UVServiceWorker();

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

addEventListener("fetch", event => {
  if (sharedProxyPath) {
		if (defaultProxy === "aero") {
			return event.respondWith(aeroHandler(event));
		} else if (defaultProxy === "uv") {
			return event.respondWith(uv.handle(event));
		} else {
			let err = `Fatal error: there is no implementation for the default proxy provided: ${defaultProxy}`;
			if (!isValidProxy(defaultProxy)) {
				err = `Fatal error: trying to route to the default proxy, but the default proxy provided is invalid: ${defaultProxy}`;
			}
			console.error(err);
			return event.respondWith(
				() =>
					new Response(err, {
						status: 500
					})
			);
		}
  } else {
    if (event.request.url.startsWith(__uv$config.prefix))
      return event.respondWith(uv.fetch(event));
    else if (event.request.url.startsWith(aeroConfig.aeroPrefix))
      return event.respondWith(aeroHandler(event));
  }
});

function isValidProxy(proxy) {
	return ["aero", "uv"].includes(proxy);
}
