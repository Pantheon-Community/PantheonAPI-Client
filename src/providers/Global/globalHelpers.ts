import type { ErrorData } from "@/contexts/Global/GlobalTypes";
import type { SiteErrorObject } from "@/shared/types/SiteErrorObject";

interface MaybeError {
	title?: unknown;

	description?: unknown;
}

function isSiteErrorObject(error: unknown): error is SiteErrorObject {
	if (typeof error !== "object") return false;
	if (error === null) return false;
	if (typeof (error as MaybeError).title !== "string") return false;
	if (typeof (error as MaybeError).description !== "string") return false;
	return true;
}

export function isAbortError(error: unknown): boolean {
	return error instanceof Error && error.name === "AbortError";
}

export function isRateLimitError(response: Response | undefined): number | null {
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

	if (error instanceof Error) {
		return { title: error.name as Capitalize<string>, description: error.message };
	}

	if (typeof error === "string") {
		return { title: "Error", description: error };
	}

	throw error;
}

export function parseStatus(response: Response | undefined): ErrorData["status"] {
	if (response === undefined) {
		return null;
	}

	return { code: response.status, text: response.statusText };
}
