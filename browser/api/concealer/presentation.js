if ("Presentation" in window)
	PresentationRequest = new Proxy(PresentationRequest, {
		construct(_that, args) {
			// Could either be a string or an array
			let [urls] = args;

			if (Array.isArray(urls)) {
				for (let url of urls) url = $aero.wrap(urls);
			} else urls = $aero.wrap(urls);

			args[0] = urls;

			const ret = Reflect.construct(...arguments);

			ret.url = $aero.afterPrefix(ret.url);

			// TODO: ret.onconnect
			/*
			ret.onconnect = new Proxy(ret.onconnect, {
				apply() {},
			});
			*/

			return ret;
		},
	});
