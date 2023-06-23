import { flags, wrtcBackends } from "config";

import escape from "browser/misc/escape";

if (flags.wrtc) {
	RTCPeerConnection = new Proxy(RTCPeerConnection, {
		construct(target, args) {
			let [config] = args;

			// Backup
			const iceServersBak = config.iceServers;

			if (config.iceServers && wrtcBackends.length > 0) {
				config.iceServers = wrtcBackends;
				args[0] = config;
			}

			const ret = new target(...args);

			ret["_iceServers"] = iceServersBak;

			return ret;
		},
		get(target, prop) {
			return typeof prop === "string" && escape("iceServers").test(prop)
				? `_${prop}`
				: Reflect.get(target, prop);
		},
		set(target, prop, value) {
			return typeof prop === "string" && escape("iceServers").test(prop)
				? (target[`_${prop}`] = value)
				: Reflect.set(target, prop, value);
		},
	});
}
