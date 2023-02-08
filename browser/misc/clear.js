/*
CORS Emulation
Emulates the Clear Site Data header
*/
if (flags.experimental)
	navigator.serviceWorker.addEventListener("message", event => {
		if (event.data === "clearExecutionContext") {
			location.reload();
		}
	})

// Private scope
{
	const clear = $aero.cors.clear;

	if (clear) {
		const all = clear.includes("'*'");

		if (all || clear.includes("'cookies'")) {
			// TODO: Clear Cookies
		}

		// Storage
		if (all || clear.includes("'storage'")) {
			// iDB
			indexedDB.databases().then(({ name }) => {
				if (name.startsWith($aero.storageNomenclature))
					indexedDB.deleteDatabase(name);
			});

			function deleteStorage(name) {
				if (name in window) {
					const storage = window[name];

					if (storage instanceof Storage) {
						for (let [key] of Object.entries(storage))
							if (key.startsWith($aero.storageNomenclature))
								storage.removeItem(key);
					}
				}
			}
			deleteStorage("'localStorage'");
			deleteStorage("'sessionStorage'");

			if ($aero.config.flags.legacy && "openDatabase" in window) {
				// TODO: Clear SQL
				null;
			}

			// TODO: Clear all filesystem data

			// TODO: Clear all service worker registrations
		}
	}
}
