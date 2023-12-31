browser.scripting = {};

browser.scripting.executeScript = async details => {
	//details.func(...details.args).bind(this);
};

// TODO: Respect details.origin

browser.scripting.insertCSS = async details => {
	const msg = {
		type: "Style",
		action: "Insert",
		files: details.files,
	};

	new BroadcastChannel(
		`BROWSER_TAB_${details.target.tabId}_INJECT`,
	).postMessage(msg);
	if (frameIds)
		for (const id of ids)
			new BroadcastChannel(`BROWSER_FRAME_${id}_INJECT`).postMessage(msg);
	else if (allFrames === true)
		const bc = new BroadcastChannel("BROWSER_FRAMES_INJECT").postMessage(
			msg,
		);
};

// TODO: ...
