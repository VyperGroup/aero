import Listener from "./util/Listener";

// In seconds
const checkFreq = 60;

type Timer = {
	id: number;
	alarm: browser.alarms.Alarm;
};
// name, Timer
let timers = new Map<string, Timer>();

const listener = new Listener(browser.alarms, "onalarm");

// @ts-ignore
browser.alarms = {};

// @ts-ignore
browser.alarms.clear = async name => {
	const { id, alarm } = timers.get(name);

	// Clear
	clearTimeout(id);
	timers.delete(name);

	return alarm;
};
browser.alarms.clearAll = async () => {
	// @ts-ignore
	if (timers.size === 0) return false;

	// @ts-ignore
	for (const [name, alarm] of timers) {
		const { id } = alarm;

		// Clear
		clearTimeout(id);
		timers.delete(name);
	}

	return true;
};

// FIXME: This type signature was incorrectly described
// @ts-ignore
browser.alarms.create = (name: string, alarm: browser.alarms.Alarm) => {
	timers.set(name, {
		// FIXME: Don't use Node types
		// @ts-ignore
		id: setTimeout(alarm.scheduledTime, () => listener.listeners.forEach),
		alarm: alarm,
	});
};
browser.alarms.get = async name => timers.get(name).alarm;
// FIXME: This type signature was incorrectly described
// @ts-ignore
browser.alarms.getAll = async searchName =>
	// @ts-ignore
	[...timers.entries()].filter(([name]) => name === searchName);
