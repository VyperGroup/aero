import shared from "./integral.val";
import classicScript from "./integral.classic.val";
import modScript from "./integral.mod.val";

export default (isMod: boolean) =>
	`${shared}${isMod ? modScript : classicScript}}();`;
