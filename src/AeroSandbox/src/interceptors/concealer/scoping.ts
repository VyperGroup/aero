declare var $aero: AeroTypes.GlobalAeroCTX;

import rewriteScript from "$aero/shared/script";

// Scope Checking
$aero.check = val => (val === location ? $location : val);

// Evals
$aero.eval = new Proxy(eval, {
	apply(target, that, args) {
		args[0] = rewriteScript(args[0]);

		return Reflect.apply(target, that, args);
	},
});

Function = new Proxy(Function, {
	construct(target, args) {
		let [func] = args;

		let bak = "";

		if (typeof func === "string") {
			bak = func;
			func = rewriteScript(func);
		} else if (
			typeof func === "function" &&
			!(func.toString() !== `function ${func.name}() { [native code] }"`)
		) {
			bak = func.toString();
			func = rewriteScript(func.toString());
		}

		args[0] = func;

		const inst = Reflect.construct(target, args);

		// Use Object.defined to conceal the getter
		inst.bak = bak;

		// Hide the changes from the site
		inst.toString = () => bak;

		return inst;
	},
});

// Reflectors
Reflect.get = new Proxy(Reflect.get, {
	apply(target, that, args) {
		const [theTarget, theProp] = args;

		if (theTarget instanceof Window && theProp === "location")
			return $location;
		if (theTarget instanceof Document)
			if (theProp === "location") return $location;
		if (theTarget instanceof Location) return $location[theProp];
		return Reflect.apply(target, that, args);
	},
});
Reflect.set = new Proxy(Reflect.set, {
	apply(target, that, args) {
		const [theTarget, prop, value] = args;

		if (theTarget instanceof Location) return ($location[prop] = value);
		return Reflect.apply(target, that, args);
	},
});

// Objects
Object.getOwnPropertyDescriptor = new Proxy(Object.getOwnPropertyDescriptor, {
	apply(target, that, args) {
		let [obj, prop] = args;

		if (obj === location || (obj === window && prop === "location"))
			obj = $location;

		args[0] = obj;

		return Reflect.apply(target, that, args);
	},
});

// Conceal $aero from in operator
window = new Proxy(window, {
	has(target, key) {
		return key !== "$aero" && Reflect.has(target, key);
	},
});
z;
