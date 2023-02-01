if (
	// Not finished
	$aero.config.flags.misc &&
	// Only supported on Chromium
	"navigation" in window
) {
	Object.defineProperty($aero, "navigationEntry", {
		get: () => $aero.proxyLocation.href,
	});

	// Entries
	navigation.currentEntry.url = $aero.navigationEntry;
	navigation.entries = new Proxy(navigation.entries, {
		apply(target, that, args) {
			const entries = Reflect.apply(...arguments);

			// We may delete some entries, so we will update the index with the new index
			let i = 0;
			const newEntries = [];

			for (let entry of entries) {
				const newEntry = entry;

				// The original property is a getter property, as the value will be changed dynamically
				const tempBak = entry.url;
				Object.defineProperty(newEntry, "url", {
					get: () => tempBak.replace($aero.afterPrefix, ""),
				});

				try {
					if (
						new URL(newEntry.url).origin !==
						$aero.proxyLocation.origin
					) {
						// The site is not supposed to see this entry
						continue;
					}
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

	if (navigation.transition !== null)
		navigation.transition.from = $aero.navigationEntry;

	navigation.addEventListener = (type, listener) => event => {
		if (type === "currententrychange")
			Object.defineProperty(event.from, "url", {
				get: () => $aero.afterPrefix(event.from.url),
			});

		return listener(event);
	};
}
