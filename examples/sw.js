/**
 * @type {string}
 */
const dirToAeroConfig = "/aero/";

importScripts(`${dirToAeroConfig}config.aero.js`);
importScripts(aeroConfig.bundle["bare-mux"]);
importScripts(aeroConfig.bundle.handle);

addEventListener("install", skipWaiting);

addEventListener("fetch", ev => ev.respondWith(handle(ev)));
