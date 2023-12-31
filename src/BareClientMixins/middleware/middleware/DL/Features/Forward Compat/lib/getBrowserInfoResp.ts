import UAParser from "ua-parser-js";

export default (resp: Response) =>
	new UAParser(resp.headers.get("user-agent")).getBrowser();
