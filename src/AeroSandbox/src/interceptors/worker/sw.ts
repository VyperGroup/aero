import config from "$aero_config";
const { flags } = config;

if (flags.workers) {
	// This will not need to use the original function, because all functionality is emulated here. This means that a Proxy object shouldn't be used here.
	// TODO: In the second param: Get the options type from the internal type system used
	Navigator.serviceworker.register = (scriptUrl: string, options?: any) => {
		// TODO: Message the scriptUrl to the SW
		// TODO: Return an emulated error
	};
}
