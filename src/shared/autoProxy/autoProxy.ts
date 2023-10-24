import prefix from "./prefix";

import afterPrefix from "shared/afterPrefix";

function proxy(
	api: string,
	mapRewriteArgs?: Map<number, Function>,
	rewriteResult?: Function
) {
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
function proxyConstruct(api: string, mapRewriteArgs: Map<number, Function>) {
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
function proxyGet(api: string, mapReplaceProps: Map<string, Function>) {
	if (api in window)
		window[api] = new Proxy(window[api], {
			get(target, theProp) {
				if (
					typeof theProp === "string" &&
					mapReplaceProps.has(theProp)
				) {
					const handler = mapReplaceProps.get(theProp);
					if (handler) return handler(theProp);
				}

				return Reflect.get(target, theProp);
			},
		});
}

function proxyString(apiName: string, argNums?: number[], res?: boolean) {
	if (argNums) {
		const map = new Map<number, (...args: string[]) => string>();

		for (const argNum of argNums)
			map.set(argNum, function () {
				return prefix + arguments[argNum];
			});

		proxy(apiName, map);
	}
	if (res) proxy(apiName, undefined, res => afterPrefix(res));
}
function proxyConstructString(
	apiName: string,
	argNums?: number[],
	res?: boolean
) {
	if (argNums) {
		const map = new Map<number, (...args: string[]) => string>();

		for (const argNum of argNums)
			map.set(argNum, function () {
				return prefix + arguments[argNum];
			});

		proxy(apiName, map);
	}
	if (res) proxy(apiName, undefined, res => afterPrefix(res));
}
function proxyGetString(apiName: string, props: string[]) {
	const map = new Map();

	for (const prop of props) map.set(prop, afterPrefix);

	proxyGet(apiName, map);
}

export default proxy;
export {
	proxyConstruct,
	proxyGet,
	proxyString,
	proxyConstructString,
	proxyGetString,
};
