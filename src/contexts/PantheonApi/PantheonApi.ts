import type { PantheonErrorData } from "@/types/PantheonErrorData";

export interface RequestFlags {
    isAuthRelated?: boolean;
}

export interface PantheonApi {
    readonly loginUrl: string;

    readonly isRateLimited: boolean;

    readonly latestError: PantheonErrorData | null;

    makeRequest(path: string, init?: RequestInit, flags?: RequestFlags): Promise<boolean>;

    makeJsonRequest<T>(path: string, init?: RequestInit, flags?: RequestFlags): Promise<T | null>;

    makeTextRequest(path: string, init?: RequestInit, flags?: RequestFlags): Promise<string | null>;
}
