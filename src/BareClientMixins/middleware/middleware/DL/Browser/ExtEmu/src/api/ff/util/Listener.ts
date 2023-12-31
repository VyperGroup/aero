export default class {
	listeners = new Map<Function, object>();

	constructor(api: object, eventName: string) {
		const event = `on${eventName}`;

		api[event].addListener = function (listener: Function) {
			this.listeners.set(listener, {
				...arguments,
			});
		};
		api[event].removeListener = function (listener: Function) {
			this.listeners.delete(listener);
		};
		// TODO:
		api[event].hasListener = () => null;
	}
}
