import { Config } from "$types/config";

import JSRewriter from "./sandboxers/JS/JSRewriter";

// TODO: Init

const jsRewriter = new JSRewriter();

const config: Config = {
	webrtcTurnServers: ["stun:stun.l.google.com:19302"],
	htmlSandboxElementName: "aero-html-sandbox"
};

export default config;
