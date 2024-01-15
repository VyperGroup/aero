import config from "$aero_config";
const { prefix } = config;

import { rewriteSetCookie } from "$aero/shared/cookie";
import { rewriteAuthServer } from "./auth";

const ignoredHeaders = [
	"cache-control",
	"clear-site-data",
	"content-encoding",
	"content-length",
	"content-security-policy",
	"content-security-policy-report-only",
	"cross-origin-resource-policy",
	"cross-origin-opener-policy",
	"cross-origin-opener-policy-report-only",
	"report-to",
	// TODO: Emulate this
	"strict-transport-security",
	"x-content-type-options",
	"x-frame-options",
];

function rewriteLocation(url: string): string {
    return self.location.origin + prefix + url;
}

export default (headers: Headers, proxyUrl: URL): Headers => {
    const rewrittenHeaders = new Headers();

    rewrittenHeaders.set("x-headers", JSON.stringify({ ...headers }));

    for (const [key, value] of headers.entries()) {
        if (ignoredHeaders.includes(key)) continue;

        switch (key) {
            case "location":
                rewrittenHeaders.set(key, rewriteLocation(value));
                break;
            case "set-cookie":
                rewrittenHeaders.set(key, rewriteSetCookie(value, proxyUrl));
                break;
            case "www-authenticate":
                rewriteAuthServer(value, proxyUrl); // Assumes this handles header setting
                break;
            default:
                rewrittenHeaders.set(key, value);
        }
    }

    return rewrittenHeaders;
};