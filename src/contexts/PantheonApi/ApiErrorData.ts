import type { SiteErrorObject } from "@/shared/types/SiteErrorObject";

export interface ApiResponseData {
	readonly code: number;

	readonly text: string;
}

export interface ApiErrorData {
	readonly error: SiteErrorObject;

	readonly status: ApiResponseData | null;
}
