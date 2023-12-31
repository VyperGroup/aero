import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

import sharp from "sharp";
import pngToIco from "ts-png-to-ico";

// For image and video conversion
const ffmpeg = createFFmpeg({ log: true });

// Ordered by importance
// TODO: Cache all converted assets

async function convertAPNGtoGIF(apngResp: Response): Promise<Response> {
	// Load the ffmpeg core
	await ffmpeg.load();

	// Write the APNG data to memory
	ffmpeg.FS(
		"writeFile",
		"input.apng",
		new Uint8Array(await apngResp.arrayBuffer()),
	);

	// Run the ffmpeg command to convert APNG to GIF
	await ffmpeg.run("-i", "input.apng", "output.gif");

	// Return a Blob URL for the GIF based on the result
	return new Response(
		new Blob([ffmpeg.FS("readFile", "output.gif").buffer], {
			type: "image/gif",
		}),
	);
}

// For favicons
async function convertSVGToICO(svgResponse: Response): Promise<Response> {
	return new Response(
		new Blob(
			[
				await pngToIco(
					await sharp(Buffer.from(await svgResponse.arrayBuffer()))
						.png()
						.toBuffer(),
				),
			],
			{ type: "image/x-icon" },
		),
	);
}
async function convertPNGToICO(pngResponse: Response): Promise<Response> {
	return new Response(
		new Blob(
			[
				await pngToIco(
					Buffer.from(await (await pngResponse.blob()).arrayBuffer()),
				),
			],
			{ type: "image/x-icon" },
		),
	);
}

// For lesser loads (Not necessary to function)
async function convertVideoToGIF(url: string): Promise<Blob> {
	// Load the ffmpeg core
	await ffmpeg.load();

	// Fetch the video data from the URL and write it to memory
	ffmpeg.FS("writeFile", "input.video", await fetchFile(url));

	// Run the ffmpeg command to convert the video to a GIF
	await ffmpeg.run(
		"-i",
		"input.video",
		"-vf",
		"fps=10,scale=320:-1:flags=lanczos",
		"-c:v",
		"gif",
		"output.gif",
	);

	// Return a Blob URL for the GIF based on the result
	return new Blob([ffmpeg.FS("readFile", "output.gif")], {
		type: "image/gif",
	});
}

export {
	convertAPNGtoGIF,
	convertSVGToICO,
	convertPNGToICO,
	convertVideoToGIF,
};
