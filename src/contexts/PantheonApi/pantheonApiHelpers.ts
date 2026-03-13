import type { SiteErrorObject } from "@/shared/types/SiteErrorObject";
import type { NonOkResponseData } from "@/types/NonOkResponseData";

export function makeLoginLink(clientId: string, redirectUri: string, state: string): string {
    const linkParams = new URLSearchParams([
        ["response_type", "code"],
        ["client_id", clientId],
        ["state", state],
        ["redirect_uri", redirectUri],
        ["scope", "identify+connections"],
    ]);

    return `https://discord.com/oauth2/authorize?${linkParams.toString()}`;
}

function isSiteErrorObject(error: unknown): error is SiteErrorObject {
    if (typeof error !== "object") return false;
    if (error === null) return false;

    if (!("title" in error)) return false;
    if (!("description" in error)) return false;

    if (typeof error.title !== "string") return false;
    if (typeof error.description !== "string") return false;

    return true;
}

export function isAbortError(error: unknown): boolean {
    return error instanceof Error && error.name === "AbortError";
}

export function parseRateLimitHeader(response: Response | undefined): number | null {
    if (response?.status !== 429) return null;

    const headerValue = response.headers.get("ratelimit");

    if (headerValue === null) {
        console.warn("Rate limited but no header value! Defaulting to one minute");
        return 60;
    }

    const rawTimeRemaining = headerValue
        .split(";")
        .map((x) => x.trim().split("="))
        .filter((x) => x.length === 2)
        .find((x) => x[0] === "t")
        ?.at(1)
        ?.trim();

    if (rawTimeRemaining === undefined || rawTimeRemaining === "") {
        console.warn("Rate limited but invalid header value! Defaulting to one minute");
        return 60;
    }

    const timeRemaining = Number(rawTimeRemaining);

    if (!Number.isSafeInteger(timeRemaining) || timeRemaining < 0) {
        console.warn(
            `Rate limited but header value is cursed! Expected a positive integer but got "${rawTimeRemaining}". Defaulting to one minute`,
        );
        return 60;
    }

    return timeRemaining;
}

export function parseError(error: unknown): SiteErrorObject {
    if (isSiteErrorObject(error)) {
        return error;
    }

    if (
        error instanceof TypeError &&
        error.message === "NetworkError when attempting to fetch resource."
    ) {
        return { title: "API Unresponsive", description: "Our server might be down right now :(" };
    }

    if (error instanceof Error) {
        return { title: error.name as Capitalize<string>, description: error.message };
    }

    if (typeof error === "string") {
        return { title: "Error", description: error };
    }

    throw error;
}

export function parseResponseStatus(response: Response | undefined): NonOkResponseData | null {
    if (response === undefined) {
        return null;
    }

    return { code: response.status, text: response.statusText };
}
