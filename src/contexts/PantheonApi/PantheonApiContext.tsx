import { RateLimitedDialog } from "@/components/Dialogs/RateLimitedDialog/RateLimitedDialog";
import { BROWSER_STATE } from "@/constants/browserState";
import type { PantheonErrorData } from "@/types/PantheonErrorData";
import { notImplementedFunction } from "@/utils/notImplementedFn";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSettings } from "../Settings/SettingsContext";
import type { PantheonApi, RequestFlags } from "./PantheonApi";
import {
    isAbortError,
    makeLoginLink,
    parseError,
    parseRateLimitHeader,
    parseResponseStatus,
} from "./pantheonApiHelpers";

const PantheonApiContext = createContext<PantheonApi>({
    loginUrl: "",
    isRateLimited: false,
    latestError: null,
    makeRequest: notImplementedFunction,
    makeJsonRequest: notImplementedFunction,
    makeTextRequest: notImplementedFunction,
});

export const PantheonApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { discordClientId, redirectUri, serverUrl } = useSettings();

    const loginUrl = useMemo(() => {
        return makeLoginLink(discordClientId, redirectUri, BROWSER_STATE);
    }, [redirectUri, discordClientId]);

    const [rateLimitEndsAt, setRateLimitEndsAt] = useState<number | null>(null);

    const [latestError, setLatestError] = useState<PantheonErrorData | null>(null);

    const isRateLimited = useMemo(() => rateLimitEndsAt !== null, [rateLimitEndsAt]);

    useEffect(() => {
        // clear rate limited status after it expires

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
        async (path: string, init: RequestInit | undefined, flags: RequestFlags | undefined) => {
            if (isRateLimited) return null;

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
                const rateLimitTimeRemaining = parseRateLimitHeader(response);

                if (rateLimitTimeRemaining !== null) {
                    setRateLimitEndsAt(Date.now() + 1000 * rateLimitTimeRemaining);
                } else if (!isAbortError(error)) {
                    console.error(error);

                    setLatestError({
                        error: parseError(error),
                        status: parseResponseStatus(response),
                        suggestLogout: flags?.isAuthRelated === true,
                        close: () => setLatestError(null),
                    });
                }

                return null;
            }
        },
        [serverUrl, isRateLimited],
    );

    const makeRequest = useCallback(
        async (path: string, init?: RequestInit, flags?: RequestFlags): Promise<boolean> => {
            const result = await makeRequestInternal(path, init, flags);
            return result !== null;
        },
        [makeRequestInternal],
    );

    const makeJsonRequest = useCallback(
        async <T,>(path: string, init?: RequestInit, flags?: RequestFlags): Promise<T | null> => {
            const result = await makeRequestInternal(path, init, flags);

            if (result === null) return null;

            return await result.json();
        },
        [makeRequestInternal],
    );

    const makeTextRequest = useCallback(
        async (path: string, init?: RequestInit, flags?: RequestFlags): Promise<string | null> => {
            const result = await makeRequestInternal(path, init, flags);

            if (result === null) return null;

            return await result.text();
        },
        [makeRequestInternal],
    );

    const handleRateLimitedClose = useCallback(() => setRateLimitEndsAt(null), []);

    const value = useMemo<PantheonApi>(() => {
        return {
            loginUrl,
            isRateLimited,
            latestError,
            setLatestError,
            makeRequest,
            makeJsonRequest,
            makeTextRequest,
        };
    }, [isRateLimited, makeRequest, makeTextRequest, makeJsonRequest, latestError, loginUrl]);

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
