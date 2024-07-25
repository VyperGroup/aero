import {
	AltProtocolEnum,
	APIInterceptor,
	ExposedContextsEnum
} from "$types/apiInterceptors";

import config from "$aero/config";
const { wrtcBackends } = config;

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import escape from "$shared/escape";

export default {
	proxifiedObj: Proxy.revocable(RTCPeerConnection, {
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
				? target[`_${prop}`]
				: Reflect.get(target, prop);
		},
		set(target, prop, value) {
			if (typeof prop === "string" && escape("iceServers").test(prop)) {
				target[`_${prop}`] = value;
				return true;
			}
			return Reflect.set(target, prop, value);
		}
	}),
	globalProp: "RTCPeerConnection",
	forAltProtocol: AltProtocolEnum.webRTC,
	exposedContexts: ExposedContextsEnum.window
} as APIInterceptor;
