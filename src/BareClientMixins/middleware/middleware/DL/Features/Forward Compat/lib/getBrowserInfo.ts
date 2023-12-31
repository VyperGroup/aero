import UAParser from "ua-parser-js";

export default () => new UAParser(navigator.userAgent).getBrowser();
