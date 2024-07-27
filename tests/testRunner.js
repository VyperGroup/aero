async function runTests() {
	for (const [testType, testHandler] of tests.entries()) {
		if (testHandler instanceof GeneratorFunction) {
			const testRunner = testHandler();
			while (true) {
				const { done, value } = testRunner.next();
				if (done) break;
				const testRes = value;
				failedTests.push([testType, ...testRes]);
			}
		} else if (testHandler instanceof AsyncFunction) {
			const testPassed = await testHandler();
			if (!testPassed) failedTests.push([testType]);
		} else if (testHandler instanceof Function) {
			const testPassed = testHandler();
			if (!testPassed) failedTests.push([testType]);
		}
	}
}

runTests().then(() => {
	// TODO: Display results in the DOM
	for (const failedTest of failedTests) {
		console.log("Failed test:", failedTest);
	}
});
