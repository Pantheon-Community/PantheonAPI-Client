import { RateLimitedDialog } from "@/components/Dialogs/RateLimitedDialog";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSettings } from "../Settings/SettingsContext";
import { notImplementedFunction, notImplementedFunctionAsync } from "../utils";
import type { ApiErrorData } from "./ApiErrorData";
import type { ExtraInit, PantheonApi } from "./PantheonApi";
import { isAbortError, isRateLimitError, parseError, parseStatus } from "./pantheonApiHelpers";

const PantheonApiContext = createContext<PantheonApi>({
    isRateLimited: false,
    latestError: null,
    handleErrorClose: notImplementedFunction,
    makeRequest: notImplementedFunctionAsync,
    makeJsonRequest: notImplementedFunctionAsync,
    makeTextRequest: notImplementedFunctionAsync,
});

export const PantheonApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { serverUrl } = useSettings();

    const [rateLimitEndsAt, setRateLimitEndsAt] = useState<number | null>(null);

    const [latestError, setLatestError] = useState<ApiErrorData | null>(null);

    const isRateLimited = useMemo(() => rateLimitEndsAt !== null, [rateLimitEndsAt]);

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
        async (path: string, init: RequestInit | undefined, extraInit: ExtraInit | undefined) => {
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
                    console.error(error);

                    setLatestError({
                        error: parseError(error),
                        status: parseStatus(response),
                        isAuthRelated: extraInit?.isAuthRelated === true,
                    });
                }

                return null;
            }
        },
        [rateLimitEndsAt, serverUrl],
    );

    const makeRequest = useCallback(
        async (path: string, init?: RequestInit, extra?: ExtraInit): Promise<boolean> => {
            const result = await makeRequestInternal(path, init, extra);
            return result !== null;
        },
        [makeRequestInternal],
    );

    const makeJsonRequest = useCallback(
        async <T,>(path: string, init?: RequestInit, extra?: ExtraInit): Promise<T | null> => {
            const result = await makeRequestInternal(path, init, extra);

            if (result === null) return null;

            return await result.json();
        },
        [makeRequestInternal],
    );

    const makeTextRequest = useCallback(
        async (path: string, init?: RequestInit, extra?: ExtraInit): Promise<string | null> => {
            const result = await makeRequestInternal(path, init, extra);

            if (result === null) return null;

            return await result.text();
        },
        [makeRequestInternal],
    );

    const handleErrorClose = useCallback(() => setLatestError(null), []);

    const handleRateLimitedClose = useCallback(() => setRateLimitEndsAt(null), []);

    const value = useMemo<PantheonApi>(() => {
        return {
            isRateLimited,
            latestError,
            handleErrorClose,
            makeRequest,
            makeJsonRequest,
            makeTextRequest,
        };
    }, [
        isRateLimited,
        makeRequest,
        makeTextRequest,
        makeJsonRequest,
        latestError,
        handleErrorClose,
    ]);

    return (
        <PantheonApiContext.Provider value={value}>
            {rateLimitEndsAt !== null && (
                <RateLimitedDialog endsAt={rateLimitEndsAt} onClose={handleRateLimitedClose} />
            )}

            {children}
        </PantheonApiContext.Provider>
    );
};

export const usePantheonApi = (): PantheonApi => useContext(PantheonApiContext);
