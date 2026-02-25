import { notImplementedFunctionAsync } from "../notImplementedFunction";
import type { SessionContextType } from "./SessionTypes";

export const defaultSessionContext: SessionContextType = {
	session: null,
	requestLogin: notImplementedFunctionAsync,
	requestRefresh: notImplementedFunctionAsync,
	requestLogout: notImplementedFunctionAsync,
};
