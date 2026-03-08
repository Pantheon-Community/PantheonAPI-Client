import type { ApiErrorData } from "./ApiErrorData";

export interface ExtraInit {
    isAuthRelated?: boolean;
}

export interface PantheonApi {
    readonly isRateLimited: boolean;

    readonly latestError: ApiErrorData | null;

    handleErrorClose(): void;

    makeRequest(path: string, init?: RequestInit, extra?: ExtraInit): Promise<boolean>;

    makeJsonRequest<T>(path: string, init?: RequestInit, extra?: ExtraInit): Promise<T | null>;

    makeTextRequest(path: string, init?: RequestInit, extra?: ExtraInit): Promise<string | null>;
}
