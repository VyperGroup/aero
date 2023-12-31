import localStorage from "localforage";

const store = localStorage.createInstance({
	name: "MW_USERSCRIPTS",
});

export default async () => {
	const scripts = await store.getItem("scripts");
	return scripts instanceof Array ? scripts : [];
};
