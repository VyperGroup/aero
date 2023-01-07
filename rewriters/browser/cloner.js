// In the case of CORS attributes present the original is deleted and a new clone is made because it isn't possible to modify the CORS properties internally
$aero.Cloner = class {
	/**
	 * Clones an element without their read-only integrity attribute
	 * @constructor
	 * @param {element} - The element to be cloned
	 */
	constructor(el) {
		const clone = document.createElement(el.tagName);

		this.el = el;
		this._clone = clone;

		clone.observed = true;

		for (const name of el.getAttributeNames()) {
			if (name !== "integrity") {
				const value = el.getAttribute(name);
				clone[name] = value;
			}
		}
		if ("innerHTML" in el && el.innerHTML !== "")
			$aero.setText(clone, el.innerHTML);
	}
	clone() {
		// Insert
		this.el.after(this._clone);
	}
	cleanup() {
		if (this.el instanceof HTMLScriptElement) {
			// Disable old script by breaking the type so it doesn't run
			this.el.type = "_";
			$aero.setText(this.el, "");
		}

		this.el.remove();
	}
};
