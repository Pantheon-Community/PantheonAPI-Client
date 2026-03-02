export const baseKey = "PANTHEON_COMMUNITY_API_CLIENT" as const;

export function notImplementedFunction<T>(): T {
	throw new Error("Function not implemented.");
}

export function notImplementedFunctionAsync<T>(): Promise<T> {
	throw new Error("Function not implemented.");
}
