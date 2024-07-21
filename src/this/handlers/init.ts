// Inits all handlers
// Core functionality
import nestedSW from "../nestedSW/handler";
// Dynamic updates
import dynamic from "./dynamic";
export default () => {
	nestedSW();
	dynamic();
};
