if ($aero.config.flags.advancedScoping) {
	// In case a function overwrites the value of location in its parameters
	$aero.isLocation = val => val === location;

	$aero.check = val => (val == location ? $aero.location : val);
}

$aero.eval = new Proxy(eval, {
	apply(target, that, args) {
		args[0] = $aero.scope(
			$aero.config.flags.advancedScoping,
			$aero.config.debug.scoping,
			args[0]
		);

		return Reflect.apply(...arguments);
	},
});

Function = new Proxy(Function, {
	construct(target, args) {
		const [func] = args;

		let bak = "";

		if (typeof func === "string") {
			bak = func;
			func = $aero.scope(
				$aero.config.flags.advancedScoping,
				$aero.config.debug.scoping,
				func
			);
		} else if (
			typeof func === "function" &&
			!func.toString() !== `function ${func.name}() { [native code] }"`
		) {
			bak = func.toString();
			func = $aero.scope(
				$aero.config.flags.advancedScoping,
				$aero.config.debug.scoping,
				func.toString()
			);
		}

		args[0] = func;

		const inst = Reflect.construct(...arguments);

		inst.bak = bak;

		// Hide the changes from the site
		inst.toString = () => bak;

		return inst;
	},
});

Reflect.get = new Proxy(Reflect.get, {
	apply(target, that, args) {
		const [_target, prop] = args;

		if (_target instanceof Window && prop === "location")
			return $aero.location;
		if (_target instanceof Document) {
			if (prop === "location") return $aero.location;
			if (prop === "domain") return $aero.document.domain;
			if (prop === "URL") return $aero.document.URL;
		}
		if (_target instanceof Location) return $aero.location[prop];
		return target(...args);
	},
});

Reflect.set = new Proxy(Reflect.set, {
	apply(target, that, args) {
		const [_target, prop, value] = args;

		if (_target instanceof Location) return ($aero.location[prop] = value);
		return target(...args);
	},
});
