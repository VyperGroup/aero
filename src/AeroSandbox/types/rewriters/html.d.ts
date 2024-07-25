// biome-ignore lint/style/useEnumInitializers: <explanation>
export enum HTMLRewriterModes {
  DOMParser,
  exposedContexts,
  ExposedContextsEnum,
  MutationObserver,
}

export interface EscapeRule {
  // These rules should be applied to per element
  // Attribute to match
  attr: string;
  // Exclusion rules
  mustContain?: string[];
  cannotContain?: string[];
  // Interception methods
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  rewriter?: Function;
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  emulator?: Function;
}
