export default (configProp: string) => {
	return "$aero" in self ? self.$aero[configProp] : self.config[configProp];
};
