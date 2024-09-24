// For node (do not import in the browser)
import resolve from "node:path";

const aeroPath = resolve(__dirname, "..", "dist");
const aeroExtrasPath = resolve(__dirname, "..", "extras");

export default aeroPath;
export { aeroExtrasPath };
