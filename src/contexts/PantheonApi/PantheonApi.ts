export interface PantheonApi {
	readonly isRateLimited: boolean;

	makeRequest(path: string, init?: RequestInit): Promise<boolean>;

	makeJsonRequest<T>(path: string, init?: RequestInit): Promise<T | null>;

	makeTextRequest(path: string, init?: RequestInit): Promise<string | null>;
}
