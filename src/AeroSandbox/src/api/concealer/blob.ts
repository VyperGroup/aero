import isHtml from "$aero/shared/isHTML";

Blob = new Proxy(Blob, {
	apply(_target, _that, args) {
		const [arr, opts] = args;

		if ($aero.isHtml(opts.type))
			args[0] = arr.map(html => $aero.init + html);

		let ret = Reflect.apply(...arguments);

		let size = 0;

		args[0].forEach(html => (size += html.length));

		ret.size = size;

		return Reflect.apply(...arguments);
	},
});
