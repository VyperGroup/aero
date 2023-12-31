import agLists from "./agLists";

import { StringRuleList, RuleStorage, Engine } from "@adguard/tsurlfilter";

export default new Engine([
	...agLists.map(
		list => new RuleStorage([new StringRuleList("0", list, false, false)]),
	),
]);
