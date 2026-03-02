import {
	createContext,
	type FC,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { ErrorDialog } from "@/components/Dialogs/ErrorDialog";
import { RateLimitedDialog } from "@/components/Dialogs/RateLimitedDialog";
import { useSettings } from "../Settings/SettingsContext";
import { notImplementedFunctionAsync } from "../utils";
import type { ApiErrorData } from "./ApiErrorData";
import type { PantheonApi } from "./PantheonApi";
import { isAbortError, isRateLimitError, parseError, parseStatus } from "./pantheonApiHelpers";

const PantheonApiContext = createContext<PantheonApi>({
	isRateLimited: false,
	makeRequest: notImplementedFunctionAsync,
	makeJsonRequest: notImplementedFunctionAsync,
	makeTextRequest: notImplementedFunctionAsync,
});

export const PantheonApiProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { serverUrl } = useSettings();

	const [rateLimitEndsAt, setRateLimitEndsAt] = useState<number | null>(null);

	const [latestError, setLatestError] = useState<ApiErrorData | null>(null);

	const isRateLimited = useMemo(() => rateLimitEndsAt === null, [rateLimitEndsAt]);

	useEffect(() => {
		if (rateLimitEndsAt === null) return;

		if (rateLimitEndsAt < Date.now()) {
			setRateLimitEndsAt(null);
			return;
		}

		const msTillEnd = rateLimitEndsAt - Date.now() + 1;

		const timeout = setTimeout(setRateLimitEndsAt, msTillEnd, null);

		return () => clearTimeout(timeout);
	}, [rateLimitEndsAt]);

	const makeRequestInternal = useCallback(
		async (path: string, init?: RequestInit): Promise<Response | null> => {
			if (rateLimitEndsAt !== null) {
				return null;
			}

			let response: Response | undefined;

			try {
				response = await fetch(`${serverUrl}${path}`, init);

				if (response.ok) return response;

				const contentType = response.headers.get("content-type")?.toLowerCase();

				if (contentType !== undefined) {
					if (contentType.includes("application/json")) {
						throw await response.json();
					}

					if (contentType.includes("text/")) {
						throw await response.text();
					}
				}

				throw new Error("Received an unexpected response that could not be parsed.");
			} catch (error) {
				const asRateLimit = isRateLimitError(response);

				if (asRateLimit !== null) {
					setRateLimitEndsAt(Date.now() + 1000 * asRateLimit);
				} else if (!isAbortError(error)) {
					setLatestError({
						error: parseError(error),
						status: parseStatus(response),
					});
				}

				return null;
			}
		},
		[rateLimitEndsAt, serverUrl],
	);

	const makeRequest = useCallback(
		async (path: string, init?: RequestInit): Promise<boolean> => {
			const result = await makeRequestInternal(path, init);
			return result !== null;
		},
		[makeRequestInternal],
	);

	const makeJsonRequest = useCallback(
		async <T,>(path: string, init?: RequestInit): Promise<T | null> => {
			const result = await makeRequestInternal(path, init);

			if (result === null) return null;

			return await result.json();
		},
		[makeRequestInternal],
	);

	const makeTextRequest = useCallback(
		async (path: string, init?: RequestInit): Promise<string | null> => {
			const result = await makeRequestInternal(path, init);

			if (result === null) return null;

			return await result.text();
		},
		[makeRequestInternal],
	);

	const handleErrorClose = useCallback(() => setLatestError(null), []);

	const handleRateLimitedClose = useCallback(() => setRateLimitEndsAt(null), []);

	return (
		<PantheonApiContext.Provider
			value={{ isRateLimited, makeRequest, makeJsonRequest, makeTextRequest }}
		>
			{latestError !== null && (
				<ErrorDialog errorData={latestError} onClose={handleErrorClose} />
			)}

			{rateLimitEndsAt !== null && (
				<RateLimitedDialog endsAt={rateLimitEndsAt} onClose={handleRateLimitedClose} />
			)}

			{children}
		</PantheonApiContext.Provider>
	);
};

export const usePantheonApi = () => useContext(PantheonApiContext);
