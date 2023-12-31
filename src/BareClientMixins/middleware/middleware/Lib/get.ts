// Fetch from url
type get = (url: string | URL) => Response;
// Get the asset
type getAsset = (path: string) => Response;
// Get a url to MIDDLEWARE_DIR/assets/URL
type getAssetUrl = (path: string) => string;
