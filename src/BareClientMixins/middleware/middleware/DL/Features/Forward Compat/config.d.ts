declare module "configType" {
	export interface Config {
		// Options to lessen to load
		// Because old systems may have a hard time processing videos
		convertVideosToGifs: boolean;

		// Toggle-able polyfills / conversions that are usually done by default
		fontPrerendering: boolean;
	}
}
