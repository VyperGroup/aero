import { HTMLRewriterModes } from "./rewriters/html";

export type Config = {
  rewriters: {
    html: {
      /** DOMParser is the default */
      mode: HTMLRewriterModes;
      replaceRedirectorsWithNavigationEvents: {
        /** This will be enabled by default*/
        enabled: boolean;
        /** This is to remove functionality. If this is false, it will try to detect if navigation events are in the browser, and if they are it won't intercept the redirectors, but the code would still be in the bundle. */
        treeShake: boolean;
      };
    };
  };
};
