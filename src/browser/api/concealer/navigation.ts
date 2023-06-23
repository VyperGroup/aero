// Not finished

import { flags } from "config";

import proxy from "shared/autoproxy/autoproxy"

import afterPrefix from "shared/afterPrefix";

import { proxyLocation } from "browser/misc/proxyLocation";

declare var navigation, NavigationCurrentEntryChangeEvent;

if (
	flags.misc &&
	// Only supported on Chromium
	"navigation" in window
) {
	// Entries
	// FIXME:
	navigation.entries = new Proxy(navigation.entries, {
		apply(target, that, args) {
			const entries: any[] = Reflect.apply(target, that, args);

			// We may delete some entries, so we will update the index with the new index
			let i = 0;

			/** @const {string[]} */
			const newEntries = [];

			for (let entry of entries) {
				const newEntry = entry;

				// The original property is a getter property, as the value will be changed dynamically
				Object.defineProperty(newEntry, "url", {
					get: () => entry.url.replace(afterPrefix, ""),
				});

				try {
					if (
						new URL(newEntry.url).origin !==
						proxyLocation().origin
					)
						// The site is not supposed to see this entry
						continue;
				} catch {
					continue;
				}

				Object.defineProperty(newEntry, "index", {
					value: i++,
				});

				newEntries.push(newEntry);
			}

			return entries;
		},
	});

	if (navigation.transition)
		navigation.transition.from = proxyLocation().href;

	proxy("navigation.addEventListener", new Map().set(1, (_type, listener) => {
		return event => {
			if (event) {
				if (event instanceof NavigationCurrentEntryChangeEvent)
					event.from.url = afterPrefix(event.from.url);

				listener(event);
			} else listener();
		};
	}))
}
