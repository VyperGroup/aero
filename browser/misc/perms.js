// Private scope
{
	// Parse a permission policy
	const parsePerms = perms => {
		if (!perms) return [];

		const map = new Map();

		perms.split(",").forEach(v => {
			let [dir, allowList] = v.split("=");

			map[dir] = allowList.split(" ");
		});

		return map;
	};

	$aero.perms = new Map([
		...parsePerms($aero.sec.permsFrame),
		...parsePerms($aero.sec.perms),
	]);
}

$aero.blockPerm = perm => $aero.block($aero.perms.get(perm));

{
	const block = (api, type) =>
		(window[api] = Promise.reject(
			type ? new DOMException("", type) : new DOMException()
		));

	if ($aero.blockPerm("accelerometer")) delete Accelerometer;
	if ($aero.blockPerm("ambient-light-sensor")) delete AmbientLightSensor;
	if ($aero.blockPerm("autoplay"))
		navigator.getAutoplayPolicy = () => "disallowed";
	if ($aero.blockPerm("battery"))
		block(navigator.getBattery, "NotAllowedError");
	if ($aero.blockPerm("camera"))
		block(navigator.mediaDevices.getUserMedia, "NotAllowedError");
	if ($aero.blockPerm("display-capture"))
		block(navigator.mediaDevices.getDisplayMedia, "NotAllowedError");
	if ($aero.blockPerm("document-domain"))
		Object.defineProperty(document, "domain", {
			set: () => {
				throw new DOMException("", "SecurityError");
			},
		});
	// TODO: ...
}
