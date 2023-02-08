if ($aero.config.flags.legacy) {
	if ("openDatabase" in window)
		openDatabase = new Proxy(openDatabase, $aero.storageNomenclature);
	if ("openDatabaseSync" in window)
		openDatabaseSync = new Proxy(
			openDatabaseSync,
			$aero.storageNomenclature
		);
}
