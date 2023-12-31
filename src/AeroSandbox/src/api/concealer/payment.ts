import { flags } from "$aero_config";

import { proxyConstruct, proxyGetString } from "shared/autoProxy/autoProxy";

import rewriteSrc from "shared/src";

import { proxyLocation } from "browser/misc/proxyLocation";

// Only supported on Chromium
if ("PaymentRequest" in window)
	proxyConstruct(
		"PaymentRequest",
		new Map().set(0, methods =>
			methods.map(method => rewriteSrc(method, proxyLocation().href)),
		),
	);

if (flags.legacy && "MerchantValidationEvent" in window)
	proxyGetString("MerchantValidationEvent", ["validationURL"]);

// TODO: Conceal https://w3c.github.io/payment-handler/#dom-paymentrequestevent-toporigin
