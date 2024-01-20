import config from "$aero_config";
const { flags } = config;

import { proxyGetString } from "$aero/shared/autoProxy/autoProxy";

import rewriteSrc from "$aero/shared/src";

import { proxyLocation } from "$aero_browser/misc/proxyLocation";

// Only supported on Chromium
if ("PaymentRequest" in window)
	PaymentRequest = new Proxy(PaymentRequest, {
		construct(_target, _prop, args) {
			let [methods] = args;

			args[0] = methods.map(method => $aero.rewriteSrc(method));

			return Reflect.construct(...arguments);
		},
	});

if (flags.legacy && "MerchantValidationEvent" in window)
	proxyGetString("MerchantValidationEvent", ["validationURL"]);

// TODO: Conceal https://w3c.github.io/payment-handler/#dom-paymentrequestevent-toporigin
