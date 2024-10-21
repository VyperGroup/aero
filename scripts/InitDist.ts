import path from "node:path";
import { access, rm, mkdir, copyFile } from "node:fs/promises";

export default class InitDist {
	distDir: string;
	properDir: string;
	swDir: string;
	properDirType: string;
	logStatus: boolean;
	constructor({ dist, proper, sw }, properDirType, logStatus) {
		this.distDir = dist;
		this.properDir = proper;
		this.properDirType = properDirType;
		this.swDir = sw;
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
		if (this.logStatus)
			console.log(
				"Initializing the proper folder (...dist/<debug/prod>)"
			);
		access(this.properDir)
			.then(() => {
				rm(this.properDir, {
					recursive: true
				}).then(this.createProperDir);
			})
			// If dir doesn't exist
			.catch(this.createProperDir);
	}
	createProperDir() {
		if (this.logStatus) console.log("Creating the proper folder");
		mkdir(this.properDir).then(this.initSW);
	}
	initSW() {
		if (this.logStatus)
			console.log("Initializing the SW folder (...dist/<debug/prod>/sw");
		access(this.swDir)
			.then(() => {
				rm(this.swDir, {
					recursive: true
				}).then(this.createSW);
			})
			// If dir doesn't exist
			.catch(this.createSW);
	}
	createSW() {
		if (this.logStatus) console.log("Creating the SW folder");
		mkdir(this.swDir).then(this.initFiles);
	}
	initFiles() {
		if (this.logStatus)
			console.log("Copying over the default files to the dist folder");
		this.copySWFiles();
		this.initLogo();
	}
	copySWFiles() {
		copyFile(
			path.resolve(__dirname, "src/defaultConfig.js"),
			path.resolve(`${this.swDir}/defaultConfig.js`)
		).catch(err => {
			console.error("Error copying defaultConfig.js: ", err);
		});
	}
	initLogo() {
		copyFile(
			path.resolve(__dirname, "aero.webp"),
			path.resolve(`${this.swDir}/logo.webp`)
		).catch(err => {
			console.error("Error copying logo.webp:", err);
		});
	}
}

// If the file is being ran as a CLI script
if (require.main === module) {
	const properDirType = "DEBUG" in process.env ? "debug" : "prod";
	new InitDist(
		{
			dist: path.resolve(__dirname, "..", "dist"),
			proper: path.resolve(__dirname, "dist", properDirType),
			sw: path.resolve(__dirname, "dist", properDirType, "sw")
		},
		properDirType,
		true
	);
}
