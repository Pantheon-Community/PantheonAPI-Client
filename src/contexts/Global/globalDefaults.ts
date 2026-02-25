import { notImplementedFunctionAsync } from "../notImplementedFunction";
import type { GlobalContextType } from "./GlobalTypes";

export const defaultGlobalContext: GlobalContextType = {
	canMakeApiRequests: false,
	makeApiRequest: notImplementedFunctionAsync,
	makeApiRequestJson: notImplementedFunctionAsync,
	makeApiRequestText: notImplementedFunctionAsync,
};
