declare namespace MiddlewareTypes {
	// Both...
	type DOMProxy = Function;

	// Parameters
	// Allows for control of the DOM through messages in request handler
	// TODO: Specify function signature
	type rewriteUrls = (path: string) => string;

	// Return
	type RewriteController = {
		rewriteUrls: [];
		resp: Response;
	};
	type HTMLCommand = "skip" | "delete" | void;

	// Contexts
	export interface RequestContext {
		// This allows for an early response disgarding the proxied fetch that will happen soon. This could be something like blocking or possibly a modified library (such as the ones in something like Decentraleyes).
		resp: ResponseHandler | PromiseLike<ResponseHandler>;
		req: Request;
		id: number;
		// You may infer these with the request itself, but they are still good abstractions to have for beginners
		isHTML: boolean;
		isNavigate: boolean;
	}
	// This plays a crucial part in writing middleware for rewritable content interception as well (Which is in the module mwRewriters coming up later in the code), so that it can get more context of what lead up to the event. This means that it is used in both mw types.
	export interface ResponseContext {
		req: Request;
		resp: Response;
	}

	export type RequestHandler = (
		ctx: RequestContext,
		DOMProxy?: DOMProxy,
	) => Promise<Request | Response | RewriteController | void>;
	// TODO: Specify a return type
	export type WSRequestHandler = (ctx: RequestContext, DOMProxy?: DOMProxy) => unknown;
	export type ResponseHandler = (
		ctx: ResponseContext,
		DOMProxy?: DOMProxy,
	) => Promise<Response | void>;
	export type HTMLHandler = (el: Element) => HTMLCommand;

	interface BaseMiddleware {
		match?: string | string[];
	}
	// This is what the MW code actually interfaces with
	export interface RequestMiddleware extends BaseMiddleware {
		handle: RequestHandler;
	}
	export interface ResponseMiddleware extends BaseMiddleware {
		handle: ResponseHandler;
	}
	export interface HTMLMiddleware extends BaseMiddleware {
		handle: HTMLHandler;
	}

	export type Middleware =
		| RequestMiddleware
		| ResponseMiddleware
		| HTMLMiddleware;

	export type MiddlewareFileExport = Middleware | Middleware[];
}

// While you could write your own rewritable content interceptors for the mw interceptors, this prevents you from reinventing the weel by making the proxy's existing content interceptors extendable. In turn, it makes the middleware code easier to understand.
// By rewritable content interception, I mean modification that happens after a resource is rewritten in the proxy. For normal assets that don't need rewrites in a proxy, you should be looking for Response Middleware instead.
// TODO: Implement these into aero
declare module "mwRewriters" {
	type cssHandler = (styles: string) => Promise<string>;
	type jsHandler = (script: string) => Promise<string>;
	type jsHandlerExternal = (
		script: string,
		ctx: ResponseContext,
	) => Promise<string>;
	type headersHandler = (headers: object, proxyUrl: URL) => HeadersInit;

	export interface Rewriters {
		css: cssHandler;
		// For all scripts
		js?: jsHandler;
		// For inline scripts only
		jsInline?: jsHandler;
		// For external scripts only (The ones imported with src in them)
		jsExternal?: jsHandlerExternal;
		headers?: {
			req?: headersHandler;
			resp?: headersHandler;
		};
	}
}
