/**
 * @type {string}
 */
const dirToAero = "/aero/";

importScripts(`${dirToAero}defaultConfig.aero.js`);
importScripts(`${dirToAero}config.aero.js`);
importScripts(aeroConfig.bundles["bare-mux"]);
importScripts(aeroConfig.bundles.handle);

addEventListener("install", skipWaiting);

addEventListener("fetch", event => event.respondWith(aeroHandle(event)));
