const jsRewriterConfigGeneric = {
	modeConfigs: {
		generic: {
			proxyNamespace: testProxyNamespace,
			objPaths: {
				proxy: {
					window: "",
					location: ""
				},
				fakeVars: {
					let: `window["${proxyNamespace}"].aeroGel.fakeVarsLet`,
					const: `window["${proxyNamespace}"].aeroGel.fakeVarsConst`
				}
			}
		}
	},
	preferredParsers: {
		ast: ["oxc", "seafox"]
	},
	preferredASTWalkers: []
};

const jsRewriterConfigAST = {
	...jsRewriterConfigGeneric,
	modeDefault: "ast",
	modeModule: "ast"
};

const jsRewriterConfigAeroGel = {
	...jsRewriterConfigGeneric,
	modeDefault: "aerogel",
	modeModule: "aerogel",
	modeConfigs: {
		...jsRewriterConfigGeneric.modeConfigs.generic,
		objPaths: {
			...jsRewriterConfigGeneric.modeConfigs.generic.objPaths,
			fakeVars: {
				let: `window["${proxyNamespace}"].aeroGel.fakeVarsLet`,
				const: `window["${proxyNamespace}"].aeroGel.fakeVarsConst`
			}
		}
	}
};

let sandboxingAPIInterceptorInjects = "";

const jsSandboxingModule = Mod.scriptSandbox.default;
for (const [_apiInterceptor, ctx] of Object.entries(jsSandboxingModule))
	if (ctx.proxifiedObj) {
		const globalProp = ctx.globalProp.replace(
			/<proxyNamespace>/g,
			testProxyNamespace
		);
		const lastPropOfGlobalProp = globalProp.at(-1).pop();
		if (lastPropOfGlobalProp === "proxifiedWindow")
			jsRewriterConfigGeneric.modeConfigs.generic.objPaths.proxy.window =
				globalProp;
		if (lastPropOfGlobalProp === "proxifiedLocation")
			jsRewriterConfigGeneric.modeConfigs.generic.objPaths.proxy.location =
				globalProp;

		sandboxingAPIInterceptorInjects += `window${globalProp} =
			${ctx.proxifiedObj.toString()};`;
	}

const jsRewriterAST = new JSRewriter(jsRewriterConfigAST);
const jsRewriterAeroGel = new JSRewriter(jsRewriterConfigAeroGel);

function scopeFunction(func, type) {
	new Function(
		sandboxingAPIInterceptorInjects +
			(type === "ast" ? jsRewriterAST : jsRewriterAeroGel).wrapScript(
				func
					.toString()
					.replace(/<proxyNamespace>/g, testProxyNamespace),
				{
					rewriteOptions: {
						isModule: false
					}
				}
			)
	)();
}

async function runTests() {
	for (const [testType, testHandler] of tests.entries()) {
		if (testHandler.constructor.name === "GeneratorFunction") {
			if (testType.startsWith("scoping -")) {
				const testRunnerAST = scopeFunction(testHandler, "ast");
				runGeneratorTests(`${testType} - AST version`, testRunnerAST);
				const testRunnerAeroGel = scopeFunction(testHandler, "aerogel");
				runGeneratorTests(
					`${testType} - AeroGel version`,
					testRunnerAeroGel
				);
			} else runGeneratorTests(testType, testRunner);
		} else if (testHandler.constructor.name === "AsyncFunction") {
			const testPassed = testType.startsWith("scoping -")
				? await scopeFunction(testHandler)()
				: await testHandler();
			if (!testPassed) failedTests.push([testType]);
		} else if (testHandler instanceof Function) {
			const testPassed = testType.startsWith("scoping -")
				? scopeFunction(testHandler)()
				: testHandler();
			if (!testPassed) failedTests.push([testType]);
		}
	}
}

function runGeneratorTests(testType, testRunner) {
	while (true) {
		const { done, value } = testRunner.next();
		if (done) break;
		const testRes = value;
		failedTests.push([testType, ...testRes]);
	}
}

// This is currently for debug
runTests().then(() => {
	for (const failedTest of failedTests) {
		console.log("Failed test:", failedTest);
	}
});
