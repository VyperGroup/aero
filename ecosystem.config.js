const config = {
	buildForUnitTests: true
};

module.exports = {
	apps: [
		{
			name: "aero-dev-server",
			script: "dev-server/app.js"
		},
		{
			name: "aero-build-watch",
			script: "npm",
			args: "run build",
			env: {
				DEBUG: ""
			}
		},
		{
			name: "aero-sandbox-build-watch",
			script: "npm",
			cwd: "src/AeroSandbox",
			args: "run build",
			env: {
				DEBUG: ""
			}
		},
		{
			name: "aero-sandbox-for-unit-tests-build-watch",
			script: "npm",
			cwd: "src/AeroSandbox",
			args: "run build",
			env: {
				TEST_BUILD: ""
			}
		}
	]
};
