if ("Presentation" in window)
	PresentationRequest = new Proxy(PresentationRequest, {
		construct(target, args) {
			// Could either be a string or an array
			const [urls] = args;

			if (Array.isArray(urls)) {
				for (let url of urls) url = $aero.wrap(urls);
			} else urls = $aero.wrap(urls);

			args[0] = urls;

			const ret = Reflect.construct(...arguments);

			ret.url = $aero.afterPrefix(ret.url);

			// TODO: ret.onconnect
			ret.onconnect = new Proxy(ret.onconnect, {
				apply(target, that, args) {},
			});

			return ret;
		},
	});
