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
				DEBUG: "true"
			}
		},
		{
			name: "aero-build-winterjs",
			script: "npm",
			args: "run build",
			env: {
				DEBUG: "true",
				SERVER_ONLY: "winterjs"
			}
		},
		{
			name: "aero-build-cf-workers",
			script: "npm",
			args: "run build",
			denv: {
				SERVER_ONLY: "cf-workers"
			}
		},
		{
			name: "aero-sandbox-build-watch",
			script: "npm",
			cwd: "src/AeroSandbox",
			args: "run build",
			env: {
				DEBUG: "true",
				BUILD_MINIMAL: "true"
			}
		},
		{
			name: "aero-sandbox-for-unit-tests-build-watch",
			script: "npm",
			cwd: "src/AeroSandbox",
			args: "run build",
			env: {
				TEST_BUILD: "true"
			}
		}
	]
};
