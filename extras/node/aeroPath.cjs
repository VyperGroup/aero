// For node (do not import in the browser)
const { resolve } = require("node:path");

const aeroPath = resolve(__dirname, "..", "dist");
const aeroExtrasPath = resolve(__dirname, "..", "extras");

module.exports = aeroPath;
module.exports.aeroExtrasPath = aeroExtrasPath;
