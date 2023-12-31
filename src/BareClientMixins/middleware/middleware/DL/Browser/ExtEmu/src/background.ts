// TODO: This will use the Caches api to store extension info

import chrome from "./handler/chrome";
import ff from "./handler/ff";
import safari from "./handler/safari";

const brChrome = new BroadcastChannel("DL_CHROME");
const brFF = new BroadcastChannel("DL_FF");
const brSafari = new BroadcastChannel("DL_SAFARI");

brChrome.onmessage = chrome;
brFF.onmessage = ff;
brSafari.onmessage = safari;
