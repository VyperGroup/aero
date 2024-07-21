import { APIInterceptor, SupportEnum } from "$aero/types";

import config from "$aero/config";
const { prefix } = config;

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
					JSON.stringify(dbNames.push(newKey))
				);
		}

		return Reflect.apply(target, that, args);
	},
};

export default [
	{
		proxifiedObj: new Proxy(openDatabase, handler),
		globalProp: "openDatabase",
		supports: SupportEnum.deprecated | SupportEnum.shippingChromium,
	},
	{
		proxifiedObj: new Proxy(openDatabaseSync, handler),
		globalProp: "openDatabaseSync",
		supports: SupportEnum.deprecated | SupportEnum.shippingChromium,
	},
] as APIInterceptor[];
