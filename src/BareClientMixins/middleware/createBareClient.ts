// @ts-nocheck

// From https://github.com/tomphttp/bare-client/blob/master/src/index.ts

import { BareClient, fetchManifest } from "@tomphttp/bare-client/BareClient";

export * from "@tomphttp/bare-client/Client";
export * from "@tomphttp/bare-client/BareTypes";
export * from "@tomphttp/bare-client/BareClient";

/**
 *
 * Facilitates fetching the Bare server and constructing a BareClient.
 * @param server Bare server
 * @param signal Abort signal when fetching the manifest
 */
export async function createBareClient(
	server: string | URL,
	signal?: AbortSignal,
): Promise<BareClient> {
	const manifest = await fetchManifest(server, signal);

	return new BareClient(server, manifest);
}
