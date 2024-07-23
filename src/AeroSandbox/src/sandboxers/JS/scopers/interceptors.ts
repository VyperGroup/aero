import { APIInterceptor, ExposedContextsEnum } from "$aero/types";

import locationProxy from "$src/shared/proxyLocation";

// These interceptors conceal `location` and accessing `location` from the window object. The window proxy is injected directly into the `this` that IIFE that AeroSandbox is powered by.

// Init
const proxyNamespace = window["<proxyNamespace>"];
proxyNamespace.aeroGel = {};
const aeroGel = proxyNamespace.aeroGel;
aeroGel.fakeVars = {};

aeroGel.fakeVarsStore = new Map<
	string,
	{
		value: string;
		isConst: boolean;
	}
>();

const fakeVarsEmulationGetter = {
	get(_target, prop) {
		if (aeroGel.fakeVarsStore.has(prop))
			return aeroGel.fakeVarsStore.get(prop.value);
		else return undefined;
	},
};

aeroGel.fakeVarsLet = new Proxy(aeroGel.fakeVars, {
	...fakeVarsEmulationGetter,
	set(_target, prop, value) {
		aeroGel.fakeVarsStore.set(prop, {
			value,
		});
		return true;
	},
});
aeroGel.fakeVarsConst = new Proxy(aeroGel.fakeVars, {
	...fakeVarsEmulationGetter,
	set(_target, prop, value) {
		if (!aeroGel.fakeVarsStore.has(prop)) {
			aeroGel.fakeVarsStore.set(prop, {
				value,
				isConst: true,
			});
			return true;
		}
		return false;
	},
});

const windowProxyInterceptor: APIInterceptor = {
	proxifiedObj: ctx => {
		if (
			Object.values(ctx.specialInterceptionFeatures).includes("aeroGel")
		) {
			// Prevent detection by checking if the fakeWindow was inherited from the real window.
			const winProto = Object.getPrototypeOf(window);
			return new Proxy(window, {
				get(target, prop) {
					if (prop === "__proto__") return winProto;
					if (prop === "location") return locationProxy;
					if (typeof target[prop] === "function")
						return target[prop].bind(window);
					return target[prop];
				},
				set(target, prop, value) {
					return (target[prop] = value);
				},
				getPrototypeOf(_target) {
					return () => winProto;
				},
			});
		}
	},
	globalProp: `["<proxyNamespace>"]aeroGel.proxyWindow`,
	exposedContexts: ExposedContextsEnum.window,
};

const ProxyProxyInterceptor = {
	/**
	 * Fixes `that` in the Proxy handlers being used to reveal the window if the target in the Proxy object is a property on the window
	 * You could solve this issue with EST parsing, but that would make JS parsing way slower than it is now, so I opted to use the same window proxy object that AeroGel already uses
	 * EST parsing is flawed compared to AeroGel because it is exponentially  `n` times more expensive to keep track of what will happen in the future, which would be a part of the solution for many UV's JS rewriting escapes. That is why the Discord bundle takes so long to rewrite using full-parse methods.
	 */
	proxifiedObj: ctx => {
		if (
			Object.values(ctx.specialInterceptionFeatures).includes("aeroGel")
		) {
			return new Proxy(Proxy, {
				construct(target, args) {
					let [pTarget, handler] = args;

					if ("apply" in handler) {
						const originalApplyHandler = handler.apply;
						args[1] = (_target, _that, pArgs) => {
							// _that is null
							// _target doesn't work
							const pTargetBak = pTarget;
							pTarget = () => new Error().stack;
							const revealingStackError = pTarget();
							// Restore functionality of the target method
							pTarget = pTargetBak;
							// Get the parents that contain the method
							const targetName = pTarget.name;
							const parentObjTree = [
								...revealingStackError.matchAll(
									/Error\\n\s\s\s\sat\s([a-zA-Z.]*)/
								),
							][0].split(`.${targetName}`)[0];
							let pThat = window[parentObjTree];
							if (pThat === window)
								// @ts-ignore
								pThat = windowProxyInterceptor.proxifiedObj;
							return originalApplyHandler(pTarget, pThat, pArgs);
						};
					}

					return Reflect.construct(target, args);
				},
			});
		}
	},
	globalProp: "Proxy",
	insertLevel: 1,
};
const EventTargetInterceptor: APIInterceptor = {
	/**
	 *  If you intercept `EventTarget.prototype.addEventListener` with a Proxy object to try to trap the window events, once a window event is triggered, `event.source` can be used to get the window object. This API interceptor solves that problem by setting `event.source` to the proxified object.
	 */
	proxifiedObj: ctx =>
		new Proxy(EventTarget.prototype.addEventListener, {
			apply(target, that, args) {
				const [eventName, handler] = args;

				// TODO: Use this same interceptor to implement catchall event interception to prevent using multiple proxies for API Interception

				if (
					Object.values(ctx.specialInterceptionFeatures).includes(
						"aeroGel"
					)
				) {
					args[1] = event => {
						event.source = ProxyProxyInterceptor.proxifiedObj;
						handler(event);
					};
				}

				return Reflect.apply(target, that, args);
			},
		}),
	globalProp: "EventTarget.prototype.addEventListener",
};

export {
	windowProxyInterceptor,
	ProxyProxyInterceptor,
	EventTargetInterceptor,
};
