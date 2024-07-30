export type attrRewriteHandler = (newVal: string | Blob) => string | Blob;

export type htmlRule = {
	tagName: string;
	attrRewriteHandlers: {
		[attr: string]: attrRewriteHandler | "rewrite-src" | "rewrite-html-src";
	};
};
