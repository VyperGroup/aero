// Not finished

import config from "$aero_config";
const { flags } = config;

import afterPrefix from "$aero/shared/afterPrefix";

import { proxyLocation } from "$aero_browser/misc/proxyLocation";

declare var navigation, NavigationCurrentEntryChangeEvent;

declare var navigation: any, NavigationCurrentEntryChangeEvent: any;

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

			const newEntries: any[] = [];

			for (let entry of entries) {
				const newEntry = entry;

				// The original property is a getter property, as the value will be changed dynamically
				Object.defineProperty(newEntry, "url", {
					get: () => entry.url.replace(afterPrefix, ""),
				});

				try {
					if (new URL(newEntry.url).origin !== proxyLocation().origin)
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

			return newEntries;
		},
	});

	if (navigation.transition)
		navigation.transition.from = proxyLocation().href;

	navigation.addEventListener = new Proxy(navigation.addEventListener, {
		apply(_target, _that, args) {
			const [type, listener] = args;

			if (type === "currententrychange")
				args[1] = event => {
					if (event instanceof NavigationCurrentEntryChangeEvent)
						event.from.url = $aero.afterPrefix(event.from.url);

					listener(event);
				};

			return Reflect.apply(...arguments);
		},
	});
}
