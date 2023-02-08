{
	const prefix = `${$aero.proxyLocation.origin}_`;

	$aero.storageNomenclature = {
		apply(_target, _that, args) {
			const [key] = args;

			args[0] = prefix + key;

			return Reflect.apply(...arguments);
		},
	};
}
