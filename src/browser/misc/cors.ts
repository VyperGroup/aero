globalThis.$aero.sec.csp = globalThis.$aero.sec.headers.csp;
if (globalThis.$aero.sec.clear)
	globalThis.$aero.sec.clear = JSON.parse(
		`[${globalThis.$aero.sec.headers.clear}]`
	);
// TODO: Parse and use in perms.ts
globalThis.$aero.sec.perms = globalThis.$aero.sec.perms.split(";");
