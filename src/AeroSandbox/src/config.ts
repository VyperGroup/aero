import { Config } from "$types/config";

import JSRewriter from "./sandboxers/JS/JSRewriter";

// TODO: Init

const jsRewriter = new JSRewriter();

const config: Config = {
	webrtcTurnServers: ["stun:stun.l.google.com:19302"]
};

export default config;
