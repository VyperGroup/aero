export default (str: string): RegExp => new RegExp(`^(?:_+)?${str}$`, "g");
