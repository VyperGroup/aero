export default (configProp: string) => {
	return "$aero" in self
		? // biome-ignore lint/complexity/useLiteralKeys: <explanation>
		  self.$aero["configProp"]
		: // biome-ignore lint/complexity/useLiteralKeys: <explanation>
		  self.config["configProp"];
};
