export default interface ToBeDefined {
	defineProperty: any;
	window: {
		globalProp: string;
		proxyObject: proxifiedObjType;
	};
}

/** Key: name of API Interceptor
 * Value: the error when trying to load the API interceptor */
export type toBeDefinedErrsType = { [key: keyof APIBitwiseEnum]: Error };
