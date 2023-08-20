// Inits all handlers
// Core functionality
import nestedSW from "./nestedSW";
// Dynamic updates
import dynamic from "./dynamic";
// Extensions
import recorder from "./recorder";

export default () => {
	nestedSW();
	dynamic();
	recorder();
};
