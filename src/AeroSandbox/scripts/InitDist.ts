import { access, copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";

interface Dirs {
	dist: string;
	proper: string;
}

export default class InitDist {
	distDir: string;
	properDir: string;
	properDirType: string;
	logStatus: boolean;

	constructor(dirs: Dirs, properDirType: string, logStatus: boolean) {
		this.distDir = dirs.dist;
		this.properDir = dirs.proper;
		this.properDirType = properDirType;
		this.logStatus = logStatus;
		this.init();
	}
	init() {
		if (this.logStatus) console.log("Initializing the dist folder");
		access(this.distDir)
			.then(this.initProperDir)
			// If dir doesn't exist
			.catch(this.createDistDir);
	}
	createDistDir() {
		if (this.logStatus) console.log("Creating the dist folder");
		mkdir(this.distDir).then(this.initProperDir);
	}
	initProperDir() {
		if (this.logStatus) {
			console.log(
				"Initializing the proper folder (...dist/<debug/prod>)",
			);
		}
		access(this.properDir)
			.then(() => {
				rm(this.properDir, {
					recursive: true,
				}).then(this.createProperDir);
			})
			// If dir doesn't exist
			.catch(this.createProperDir);
	}
	createProperDir() {
		if (this.logStatus) console.log("Creating the proper folder");
		mkdir(this.properDir).then(this.createDistBuild);
	}
	createDistBuild() {
		if (this.logStatus) {
			console.log("Copying over the default config to the dist folder");
		}
		copyFile(
			path.resolve(__dirname, "src/defaultConfig.js"),
			path.resolve(
				__dirname,
				`dist/${this.properDirType}/defaultConfig.js`,
			),
		);
	}
}

// If the file is being ran as a CLI script
if (require.main === module) {
	const properDirType = "DEBUG" in process.env ? "debug" : "prod";
	new InitDist(
		{
			dist: path.resolve(__dirname, "..", "dist"),
			proper: path.resolve(__dirname, "dist", properDirType),
		},
		properDirType,
		true,
	);
}
