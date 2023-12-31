// Integrations with various extension stores, where it intercepts the install button
const lib: HTMLHandler = {
	handle: el => {
		// Chrome Web Store
		if (
			location.href.startsWith(
				"https://chrome.google.com/webstore/detail/",
			)
		) {
			const btn = document.querySelector(
				".g-c-R  .webstore-test-button-label",
			);
			if (btn instanceof HTMLDivElement)
				fixBtn(btn, "Add to Chrome", installExtChrome);
		}
		// Firefox Addons
		else if (
			location.href.startsWith(
				"https://addons.mozilla.org/en-US/firefox/addon/",
			)
		) {
			const notice = document.querySelector(".GetFirefoxButton-callout");
			notice?.remove();

			const btn = document.querySelector(
				".Button .Button--action .GetFirefoxButton-button .Button--puffy",
			);
			if (btn instanceof HTMLAnchorElement) {
				fixBtn(
					btn,
					"Add to Firefox",
					install.bind(this, btn.href, "FF"),
				);
			}
		}
		// Apple Store 🤓
		else if (location.href.startsWith("https://apps.apple.com/us/app/")) {
		}

		return;
	},
};

function fixBtn(el: HTMLElement, label: string, installHandler: Function) {
	el.innerHTML = label;

	if (el instanceof HTMLAnchorElement) el.removeAttribute("href");

	el.addEventListener("click", e => installHandler());
}

function installExtChrome() {
	const id = location.pathname.split("/").at(-1);
	const dl = `https://clients2.google.com/service/update2/crx?response=redirect&os=cros&arch=x86-64&os_arch=x86-64&nacl_arch=x86-64&prod=chromiumcrx&prodchannel=unknown&prodversion=9999.0.0.0&acceptformat=crx2,crx3&x=id%3D${id}%26uc`;

	install(dl, "Chrome");
}
function installExtSafari() {
	console.warn("WIP");
}
d;

function install(dl: string, browser: Browser) {
	const bc = new BroadcastChannel(`DL_${browser}`).postMessage(dl);
}

export default lib;
