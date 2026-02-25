import {
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
import { GlobalContext } from "@/contexts/Global";
import type { ErrorData } from "@/contexts/Global/GlobalTypes";
import { SettingsContext } from "@/contexts/Settings";
import { isAbortError, isRateLimitError, parseError, parseStatus } from "./globalHelpers";

export const GlobalProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { settings } = useContext(SettingsContext);

	const [rateLimitEndsAt, setRateLimitEndsAt] = useState<number | null>(null);

	const [latestError, setLatestError] = useState<ErrorData | null>(null);

	const canMakeApiRequests = useMemo(() => rateLimitEndsAt === null, [rateLimitEndsAt]);

	useEffect(() => {
		if (rateLimitEndsAt === null) return;

		if (rateLimitEndsAt < Date.now()) {
			setRateLimitEndsAt(null);
			return;
		}

		const msTillEnd = rateLimitEndsAt - Date.now() + 1;

		const timeout = setTimeout(setRateLimitEndsAt, msTillEnd, null);

		return () => {
			clearTimeout(timeout);
		};
	}, [rateLimitEndsAt]);

	const makeRequestInternal = useCallback(
		async (path: string, init?: RequestInit): Promise<Response | null> => {
			if (rateLimitEndsAt !== null) {
				return null;
			}

			let response: Response | undefined;

			try {
				response = await fetch(`${settings.serverUrl}${path}`, init);

				if (response.ok) {
					return response;
				}

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
		[rateLimitEndsAt, settings.serverUrl],
	);

	const makeApiRequest = useCallback(
		async (path: string, init?: RequestInit): Promise<boolean> => {
			const result = await makeRequestInternal(path, init);
			return result !== null;
		},
		[makeRequestInternal],
	);

	const makeApiRequestJson = useCallback(
		async <T,>(path: string, init?: RequestInit): Promise<T | null> => {
			const result = await makeRequestInternal(path, init);

			if (result !== null) {
				try {
					return await result.json();
				} catch (error) {
					if (!isAbortError(error)) {
						setLatestError({ error: parseError(error), status: parseStatus(result) });
					}

					return null;
				}
			}

			return null;
		},
		[makeRequestInternal],
	);

	const makeApiRequestText = useCallback(
		async (path: string, init?: RequestInit): Promise<string | null> => {
			const result = await makeRequestInternal(path, init);

			if (result !== null) {
				try {
					return await result.text();
				} catch (error) {
					if (!isAbortError(error)) {
						setLatestError({ error: parseError(error), status: parseStatus(result) });
					}

					return null;
				}
			}

			return null;
		},
		[makeRequestInternal],
	);

	const handleErrorClose = useCallback(() => setLatestError(null), []);

	const handleRateLimitedClose = useCallback(() => setRateLimitEndsAt(null), []);

	return (
		<GlobalContext.Provider
			value={{ canMakeApiRequests, makeApiRequest, makeApiRequestJson, makeApiRequestText }}
		>
			{latestError !== null && (
				<ErrorDialog errorData={latestError} onClose={handleErrorClose} />
			)}

			{rateLimitEndsAt !== null && (
				<RateLimitedDialog endsAt={rateLimitEndsAt} onClose={handleRateLimitedClose} />
			)}

			{children}
		</GlobalContext.Provider>
	);
};
