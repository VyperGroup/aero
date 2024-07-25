export type Config = {
  Support: SupportEnum;
  /**
   * This is not needed, if you are running this on aero itself, since it will automatically have the proper namespace already (no need for mapping).
   */
  ProxyConfig: ProxyConfig;
  htmlInterception?: HtmlInterceptionConfig; // Enable Element API inteception and HTML interception
  redirectors?: boolean; // Enable redirectors; default true. Concelears and redirectors are distinct options, because you might be trying to intercept link redirection. See DEV.md.
  concealers?: boolean; // Enable concealers; default true
  concealVars?: string[]; // This will use a script rewriter to conceal variables other than $aero
  jsRewriter?: Function;
  nestedSWSupport: boolean; // This requires that you import the nested SW library into your main SW file
  // Extra features
  FakerAPI?: FakerAPIConfig; // I recommend disabling: redirectors, if you enable it because it would probably not be necessary
  SWlessRuntime?: SWlessRuntimeConfig;
  rewriters: {
    html: {
      /** DOMParser is be the default */
      // TODO: Make this an enum instead
      mode: "DOMParser" | "Mutation Observer";
      replaceRedirectorsWithNavigationEvents: {
        /** This will be enabled by default*/
        enabled: boolean;
        /** This is to remove functionality. If this is false, it will try to detect if navigation events are in the browser, and if they are it won't intercept the redirectors, but the code would still be in the bundle. */
        treeShake: boolean;
      };
    };
  };
};
