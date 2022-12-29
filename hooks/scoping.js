if ($aero.config.flags.advancedScoping) {
	// In case a function overwrites the value of location in its parameters
	$aero.isLocation = val => val === location;

	$aero.check = val => (val == location ? $aero.location : val);

	$aero.eval = new Proxy(eval, {
		apply(target, that, args) {
			args[0] = $aero.scope(args[0]);

			return Reflect.apply(...arguments);
		},
	});

	Function = new Proxy(Function, {
		construct(target, args) {
			[func] = args;

			let bak = "";

			if (typeof func === "string") {
				bak = func;
				func = $aero.scope(func);
			} else if (
				typeof func === "function" &&
				!func.toString() !==
					`function ${func.name}() { [native code] }"`
			) {
				bak = func.toString();
				func = $aero.scope(func.toString());
			}

			args[0] = func;

			const inst = Reflect.construct(...arguments);

			inst.bak = bak;

			return inst;
		},
	});

	/*
	Function.prototype.toString = new Proxy(Function.prototype.toString, {
		apply: (target, that, args) => {
			//console.log(target);
			console.log(that);
			//console.log(args);
			return that.bak
		},
	});
	*/

	Reflect.get = new Proxy(Reflect.get, {
		apply(target, that, args) {
			[_target, prop] = args;
			_target instanceof Window && prop === location
				? $aero.location
				: target(...args);
		},
	});

	Reflect.set = new Proxy(Reflect.set, {
		apply(target, that, args) {
			[_target, prop, value] = args;
			_target instanceof Location && _target !== $aero.location
				? ($aero.location[prop] = value)
				: target(...args);
		},
	});
}
