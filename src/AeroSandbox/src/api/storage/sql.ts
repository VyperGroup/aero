import config from "$aero_config";
const { prefix, flags } = config;

if (flags.legacy) {
	const handler = {
		apply(target, that, args) {
			const [key]: [string] = args;

			const newKey = prefix + key;

			args[0] = newKey;

			const item = localStorage.getItem("dbNames");
			if (item !== null) {
				const dbNames: string[] = JSON.parse(item);
				if (dbNames.includes(newKey))
					localStorage.setItem(
						"dbNames",
						JSON.stringify(dbNames.push(newKey)),
					);
			}

			return Reflect.apply(target, that, args);
		},
	};

	if ("openDatabase" in window)
		window.openDatabase = new Proxy(window.openDatabase, handler);
	if ("openDatabaseSync" in window)
		window.openDatabaseSync = new Proxy(window.openDatabaseSync, handler);
}
