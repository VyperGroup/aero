// Only supported on Chromium
if ("PaymentRequest" in window) {
	/*
	FIXME: Don't use these interfaces

	PaymentRequestEvent = new Proxy(PaymentRequestEvent, {
		get(_that, prop) {
			if (prop === "validationURL") return $aero.proxyLocation.origin;
			return Reflect.get(...arguments);
		},
	});

	MerchantValidationEvent = new Proxy(PaymentRequestEvent, {
		get(_that, prop) {
			const ret = Reflect.get(...arguments);

			if (prop === "validationURL") return $aero.afterPrefix(ret);
			return Reflect.get(...arguments);
		},
	});
	*/
}
