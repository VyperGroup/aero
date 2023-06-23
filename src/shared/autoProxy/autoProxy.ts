import prefix from "./prefix";

import afterPrefix from "shared/afterPrefix";

function autoProxy(
	api: string,
	mapRewriteArgs?: Map<number, Function>,
	rewriteResult?: Function
): void {
	if (api in window)
		window[api] = new Proxy(window[api], {
			apply(target, that, args) {
				if (mapRewriteArgs)
					for (const [argNum, rewrite] of mapRewriteArgs.entries())
						if (rewrite) args[argNum] = rewrite(...args);

				let ret = Reflect.apply(target, that, args);

				if (rewriteResult) ret = rewriteResult(ret, ...args);

				return ret;
			},
		});
}
function autoProxyConstruct(
	api: string,
	mapRewriteArgs: Map<number, Function>
): void {
	if (api in window)
		window[api] = new Proxy(window[api], {
			construct(target, args) {
				if (mapRewriteArgs)
					for (const [argNum, rewrite] of mapRewriteArgs.entries())
						if (rewrite) args[argNum] = rewrite(...args);

				return Reflect.construct(target, args);
			},
		});
}
function autoProxyGet(
	api: string,
	mapReplaceProps: Map<string, Function>
): void {
	if (api in window)
		window[api] = new Proxy(window[api], {
			get(target, theProp) {
				if (typeof theProp === "string" && mapReplaceProps.has(theProp))
					return mapReplaceProps.get(theProp)(theProp);

				return Reflect.get(target, theProp);
			},
		});
}

function autoProxyString(
	apiName: string,
	argNums?: number[],
	res?: boolean
): void {
	if (argNums) {
		const map = new Map<number, (...args: string[]) => string>();

		for (const argNum of argNums)
			map.set(argNum, function () {
				return prefix + arguments[argNum];
			});

		autoProxy(apiName, map);
	}
	if (res) autoProxy(apiName, null, res => afterPrefix(res));
}
function autoProxyConstructString(
	apiName: string,
	argNums?: number[],
	res?: boolean
): void {
	if (argNums) {
		const map = new Map<number, (...args: string[]) => string>();

		for (const argNum of argNums)
			map.set(argNum, function () {
				return prefix + arguments[argNum];
			});

		autoProxy(apiName, map);
	}
	if (res) autoProxy(apiName, null, res => afterPrefix(res));
}
function autoProxyGetString(apiName: string, props: string[]): void {
	const map = new Map();

	for (const prop of props) map.set(prop, afterPrefix);

	autoProxyGet(apiName, map);
}

export default autoProxy;
export {
	autoProxyConstruct,
	autoProxyGet,
	autoProxyString,
	autoProxyConstructString,
	autoProxyGetString,
};
