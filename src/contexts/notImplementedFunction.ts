export function notImplementedFunction<T>(): T {
	throw new Error("Function not implemented.");
}

export async function notImplementedFunctionAsync<T>(): Promise<T> {
	await Promise.resolve();
	throw new Error("Function not implemented.");
}
