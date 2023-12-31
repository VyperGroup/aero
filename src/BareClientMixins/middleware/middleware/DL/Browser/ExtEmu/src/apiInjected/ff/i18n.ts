const bc = new BroadcastChannel("EXT_ACCEPT_LANGUAGES");
bc.onmessage = e => bc.postMessage(navigator.languages);
