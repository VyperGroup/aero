import { APIInterceptor, SupportEnum } from "$types/index.d";

import config from "$aero/config";
const { prefix } = config;

const handler = {
  apply(target, that, args) {
    const [key]: [string] = args;

    const newKey = prefix + key;

    args[0] = newKey;

    const item = localStorage.getItem("dbNames");
    if (item !== null) {
      const dbNames: string[] = JSON.parse(item);
      if (dbNames.includes(newKey))
        localStorage.setItem("dbNames", JSON.stringify(dbNames.push(newKey)));
    }

    return Reflect.apply(target, that, args);
  },
};

export default [
  {
    proxifiedObj: Proxy.revocable(openDatabase, handler),
    globalProp: "openDatabase",
    supports: SupportEnum.deprecated | SupportEnum.shippingChromium,
  },
  {
    proxifiedObj: Proxy.revocable(openDatabaseSync, handler),
    globalProp: "openDatabaseSync",
    supports: SupportEnum.deprecated | SupportEnum.shippingChromium,
  },
] as APIInterceptor[];
