if ($aero.config.flags.wrtc) {
	const customIceServers = [];

	RTCPeerConnection = new Proxy(RTCPeerConnection, {
		construct(target, args) {
			[config] = args;

			if (config.iceServers && customIceServers.length > 0)
				config.iceServers = customIceServers;

			return new target(...args);
		},
	});

	RTCPeerConnection.prototype.addIceCandidate = new Proxy(
		RTCPeerConnection.prototype.addIceCandidate,
		{
			apply(target, that, args) {
				[canidate] = args;

				return Reflect.apply(...arguments);
			},
		}
	);
}
