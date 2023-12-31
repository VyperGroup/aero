import { flags } from "$aero_config";

import { upToProxyLocation } from "util/upToProxyLocation";

import { storageNomenclature, storagePrefix } from "$aero_browser/misc/storage";

declare var openDatabase;

if (flags.nonstandard)
	// Emulates the Clear Site Data header
	navigator.serviceWorker.addEventListener("message", event => {
		if (event.data === "clearExecutionContext") location.reload();
	});

// Private scope
{
	if ($aero.sec.clear) {
		const clear = JSON.parse($aero.sec.clear);

		const all = clear.includes("'*'");

		if (all || clear.includes("'cookies'")) {
			function clearCookies(path) {
				const cookies = document.cookie.split(";");

				for (const cookie of cookies) {
					const eqPos = cookie.indexOf("=");

					const name =
						eqPos > -1 ? cookie.substring(0, eqPos) : cookie;

					document.cookie =
						name +
						"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" +
						path +
						";";
				}
			}
			clearCookies(upToProxyOrigin);
		}

		// Storage
		if (all || clear.includes("'storage'")) {
			// iDB
			// @ts-ignore: This is a TS Bug; the interface is not defined properly
			indexedDB.databases().then(({ name }) => {
				if (name.startsWith(storageNomenclature))
					indexedDB.deleteDatabase(name);
			});

			// Storage
			function clearStore(name: string) {
				if (name in window) {
					const storage = window[name];

					if (storage instanceof Storage) {
						for (let [key] of Object.entries(storage))
							if (key.startsWith(storagePrefix()))
								storage.removeItem(key);
					}
				}
			}
			clearStore("localStorage");
			clearStore("sessionStorage");

			// WebDatabase
			if (flags.legacy && "openDatabase" in window) {
				for (const dbName of localStorage.getItem("dbNames")) {
					openDatabase(dbName).transaction(tx => {
						tx.executeSql(
							'SELECT name FROM sqlite_master WHERE type="table"',
							[],
							(tx, data) => {
								for (let i = 0; i < data.rows.length; i++) {
									const tableName = data.rows.item(i).name;

									if (
										tableName !==
										"__WebKitDatabaseInfoTable__"
									)
										tx.executeSql(
											`DELETE FROM ${tableName}`,
										);
								}
							},
						);
					});
				}
			}

			// TODO: Clear all filesystem data

			// Service Workers
			navigator.serviceWorker.getRegistrations().then(regs => {
				for (const reg of regs) {
					if (reg.scope.startsWith(upToProxyOrigin()))
						reg.unregister();
				}
			});
		}
	}
}
