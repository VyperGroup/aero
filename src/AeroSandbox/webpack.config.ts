/* TODO:
		* Make a custom webpack loader that calls TS after wrapping the file content inside of:
		```ts
		{
			// If the proxy being used isn't already aero
			if (!("$aero" in window)) {
				const $aero = {
					// The entire point of this is that it will let you "map out" the config for the proxy of your choice that you are using to the style that aero uses. This lets you easily port any proxy. 
					${Key of AeroSandboxConfig.ProxyConfig as a string}: ${value (not as a string)}
				}
				// TODO: Declare a property called noConfigProvided on $aero, if there is no config in the AeroSandboxConfig.ProxyConfig. This is a runtime parity check.
				if ($aero.noConfigProvided)
					throw new Error("No config provided into AeroSandbox")
				else
					${FILE_CONTENT}
			}
		}
		```
	*/
