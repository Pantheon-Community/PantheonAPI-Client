/** Basic information about the HTTP status code and text of a non-200 response. */
export interface NonOkResponseData {
    /** HTTP status code. */
    readonly code: number;

    /** Corresponding text for the given code, may be an empty string. */
    readonly text: string;
}
