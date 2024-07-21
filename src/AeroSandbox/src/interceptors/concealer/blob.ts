import { APIInterceptor } from "$aero/types";
import isHtml from "$src/shared/isHTML";

export default {
	proxifiedObj: new Proxy(Blob, {
		apply(target, that, args) {
			const [arr, opts] = args;

			if (isHtml(opts.type))
				args[0] = arr.map((html: string) => $aero.init + html);

			let ret = Reflect.apply(target, that, args);

			let size = 0;

			args[0].forEach((html: string) => (size += html.length));

			ret.size = size;

			return ret;
		},
	}),
	globalProp: "Blob",
} as APIInterceptor;
