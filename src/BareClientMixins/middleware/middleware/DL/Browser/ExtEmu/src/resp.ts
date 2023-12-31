import { getTabId } from "./api/ff/util/getId";

const handleFunc = `
function handle(event) {
    const { type, action, files } = event.data;

    if (action === "Insert") {
        if (type === "Script") {
            // TODO: ...
        }
        else if (type === "Style") {
            for (const file of files) {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = file;
                document.body.appendChild(link);)
            }
        }
    }
    else if (action === "Remove") {
        // TODO: ...
    }
}`;

// TODO: Minify with WebPack
const lib: ResponseHandler = {
	handle: async ctx => {
		const injects: string = [];
		if (ctx.isHTML && ctx.isNavigate) {
			return (injects += `
new BroadcastChannel("BROWSER_TAB_${getTabId(
				ctx.id,
			)}_INJECT").onmessage = handle;
`);
		}
		if (ctx.isFrame) {
			injects += `
new BroadcastChannel("BROWSER_FRAMES_INJECT").onmessage = handle;
new BroadcastChannel("BROWSER_FRAME_${getTabId(
				ctx.id,
			)}_INJECT").onmessage = handle;
`;
		}
		if (injects.length > 0)
			return (
				`
{
    ${handleFunc}
    ${injects.join("\n")}
}
` + (await ctx.resp.text())
			);

		return ctx.resp;
	},
};

export default lib;
