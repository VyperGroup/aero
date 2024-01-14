import hrefRules from "$aero_browser/rewriters/shared/rules";

for (const [targetElClass, rules] of hrefRules) {
  customElements.define(
    "href",
    // @ts-ignore
    class extends targetElClass {
      constructor() {
        super();
      }
      // TODO: Proxy href attributes according to the rules
    },
  );
}

// In order to use you must add is="href-proxy" to every HTML element