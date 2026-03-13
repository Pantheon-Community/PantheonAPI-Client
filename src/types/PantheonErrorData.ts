import type { SiteErrorObject } from "@/shared/types/SiteErrorObject";
import type { NonOkResponseData } from "./NonOkResponseData";

/** Information about an error related to communicating with the Pantheon API. */
export interface PantheonErrorData {
    readonly error: SiteErrorObject;

    /** This might be `null` for network errors like failing to fetch. */
    readonly status: NonOkResponseData | null;

    readonly suggestLogout: boolean;

    close(): void;
}
