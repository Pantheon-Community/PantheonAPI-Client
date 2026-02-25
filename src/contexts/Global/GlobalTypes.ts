import type { SiteErrorObject } from "@/shared/types/SiteErrorObject";

export interface ErrorData {
	readonly error: SiteErrorObject;

	readonly status: { readonly code: number; readonly text: string } | null;
}

export interface GlobalContextType {
	readonly canMakeApiRequests: boolean;

	makeApiRequest(path: string, init?: RequestInit): Promise<boolean>;

	makeApiRequestJson<T>(path: string, init?: RequestInit): Promise<T | null>;

	makeApiRequestText(path: string, init?: RequestInit): Promise<string | null>;
}
