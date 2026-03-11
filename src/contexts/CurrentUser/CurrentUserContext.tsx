import { RequestMethod } from "@/shared/types/RequestMethod";
import type { LoginRequest } from "@/shared/types/Requests/LoginRequest";
import type { AuthResponse } from "@/shared/types/Responses/AuthResponse";
import type { GetMeResponse } from "@/shared/types/Responses/GetMeResponse";
import type { SteamUserBasicWithTimes } from "@/shared/types/SteamUser";
import { duration } from "@/utils/relativeTime";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useLocation } from "react-router";
import { usePantheonApi } from "../PantheonApi/PantheonApiContext";
import { useSettings } from "../Settings/SettingsContext";
import { notImplementedFunctionAsync } from "../utils";
import { getStoredCurrentUser, saveStoredCurrentUser } from "./currentUserHelpers";

interface CurrentUserContextType {
    readonly currentUser: AuthResponse | null;

    login(code: string): Promise<void>;

    logout(): Promise<void>;

    /** Refreshes the entire user and session. */
    refresh(): Promise<void>;

    /** Refreshes the entire user, which includes connections. */
    refreshUser(): Promise<void>;

    /** Refreshes only connections. */
    refreshUserConnections(): Promise<void>;

    clearPrimaryConnection(): Promise<void>;

    setPrimaryConnection(steam: SteamUserBasicWithTimes): Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextType>({
    currentUser: null,
    login: notImplementedFunctionAsync,
    logout: notImplementedFunctionAsync,
    refresh: notImplementedFunctionAsync,
    refreshUser: notImplementedFunctionAsync,
    refreshUserConnections: notImplementedFunctionAsync,
    clearPrimaryConnection: notImplementedFunctionAsync,
    setPrimaryConnection: notImplementedFunctionAsync,
});

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { redirectUri, minRefreshSeconds, maxRefreshMinutes } = useSettings();
    const { isRateLimited, makeRequest, makeJsonRequest } = usePantheonApi();

    const [currentUser, setCurrentUser] = useState(getStoredCurrentUser);

    useEffect(() => saveStoredCurrentUser(currentUser), [currentUser]);

    /** Session related lock only. */
    const isDoingSomething = useRef(false);

    const lastLoggedAt = useRef(0);

    const { pathname } = useLocation();

    const isInSettings = useMemo(() => pathname === "/settings", [pathname]);

    const login = useCallback(
        async (code: string) => {
            if (isDoingSomething.current) return;
            isDoingSomething.current = true;

            const response = await makeJsonRequest<AuthResponse>(
                "/login",
                {
                    method: RequestMethod.Post,
                    body: JSON.stringify({ code, redirectUri } satisfies LoginRequest),
                    headers: { accept: "application/json", "content-type": "application/json" },
                },
                { isAuthRelated: true },
            );

            isDoingSomething.current = false;

            if (response !== null) {
                setCurrentUser(response);
            }
        },
        [makeJsonRequest, redirectUri],
    );

    const logout = useCallback(async () => {
        if (currentUser?.token === undefined) return;

        if (isDoingSomething.current) return;
        isDoingSomething.current = true;

        await makeRequest(
            "/logout",
            {
                method: RequestMethod.Post,
                headers: { authorization: `Bearer ${currentUser.token}` },
            },
            { isAuthRelated: true },
        );

        isDoingSomething.current = false;

        setCurrentUser(null);
    }, [currentUser?.token, makeRequest]);

    const refresh = useCallback(
        async (controller?: AbortController) => {
            if (currentUser?.token === undefined) return;

            if (isDoingSomething.current) return;
            isDoingSomething.current = true;

            const response = await makeJsonRequest<AuthResponse>(
                "/refresh",
                {
                    method: RequestMethod.Post,
                    headers: {
                        authorization: `Bearer ${currentUser.token}`,
                        accept: "application/json",
                    },
                    signal: controller?.signal,
                },
                { isAuthRelated: true },
            );

            isDoingSomething.current = false;

            if (response !== null) {
                setCurrentUser(response);
            }
        },
        [currentUser?.token, makeJsonRequest],
    );

    const refreshUser = useCallback(async () => {
        if (currentUser?.token === undefined) return;

        const response = await makeJsonRequest<GetMeResponse>("/users/@me", {
            headers: {
                authorization: `Bearer ${currentUser.token}`,
                accept: "application/json",
            },
        });

        if (response !== null) {
            setCurrentUser((prev) => {
                if (prev === null) return null;

                return { ...prev, ...response };
            });
        }
    }, [makeJsonRequest, currentUser?.token]);

    const refreshUserConnections = useCallback(async () => {
        if (currentUser?.token === undefined) return;

        const response = await makeJsonRequest<SteamUserBasicWithTimes[]>(
            "/users/@me/steam-users",
            {
                headers: {
                    authorization: `Bearer ${currentUser.token}`,
                    accept: "application/json",
                },
            },
        );

        if (response !== null) {
            setCurrentUser((prev) => {
                if (prev === null) return null;

                return { ...prev, steamUsers: response };
            });
        }
    }, [currentUser?.token, makeJsonRequest]);

    const clearPrimaryConnection = useCallback(async () => {
        if (currentUser?.token === undefined) return;

        const response = await makeRequest("/users/@me/steam-users/primary", {
            method: RequestMethod.Delete,
            headers: { authorization: `Bearer ${currentUser.token}` },
        });

        if (response) {
            setCurrentUser((prev) => {
                if (prev === null) return null;

                return { ...prev, user: { ...prev.user, steam: null } };
            });
        }
    }, [currentUser?.token, makeRequest]);

    const setPrimaryConnection = useCallback(
        async (steam: SteamUserBasicWithTimes) => {
            if (currentUser?.token === undefined) return;

            const response = await makeRequest(`/users/@me/steam-users/primary/${steam.id}`, {
                method: RequestMethod.Put,
                headers: { authorization: `Bearer ${currentUser.token}` },
            });

            if (response) {
                setCurrentUser((prev) => {
                    if (prev === null) return null;

                    return { ...prev, user: { ...prev.user, steam } };
                });
            }
        },
        [currentUser?.token, makeRequest],
    );

    useEffect(() => {
        if (currentUser === null) return;
        if (isInSettings) return;
        if (isRateLimited) return;

        const expirationTime = duration(new Date(currentUser.expiresAt).getTime());

        const secondsTillExpiry = Math.floor(
            (new Date(currentUser.expiresAt).getTime() - Date.now()) / 1000,
        );

        if (secondsTillExpiry < minRefreshSeconds) {
            console.log(`[SessionProvider] Session expired ${expirationTime} ago, logging out`);
            setCurrentUser(null);
            return;
        }

        if (secondsTillExpiry < minRefreshSeconds) {
            console.log(
                `[SessionProvider] Session expires too soon to refresh (${expirationTime} ago), logging out`,
            );
            setCurrentUser(null);
            return;
        }

        const controller = new AbortController();

        const minutesTillExpiry = Math.floor(secondsTillExpiry / 60);

        if (minutesTillExpiry <= maxRefreshMinutes) {
            console.log(
                `[SessionProvider] Session expires in ${expirationTime}, attempting background refresh`,
            );

            void refresh(controller);
            return () => controller.abort();
        }

        const delay = 1000 * 60 * (minutesTillExpiry - maxRefreshMinutes);

        const scheduledAt = duration(Date.now() + delay);

        const timeout = setTimeout(refresh, delay, controller);

        if (Date.now() >= lastLoggedAt.current) {
            console.log(
                `[SessionProvider] Session expires in ${expirationTime}, background refreshed scheduled in ${scheduledAt}`,
            );

            lastLoggedAt.current = Date.now() + 1000 * 60 * 5;
        }

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [currentUser, maxRefreshMinutes, minRefreshSeconds, refresh, isInSettings, isRateLimited]);

    const value = useMemo<CurrentUserContextType>(() => {
        return {
            currentUser,
            login,
            logout,
            refresh,
            refreshUser,
            refreshUserConnections,
            clearPrimaryConnection,
            setPrimaryConnection,
        };
    }, [
        currentUser,
        logout,
        login,
        refresh,
        refreshUserConnections,
        refreshUser,
        setPrimaryConnection,
        clearPrimaryConnection,
    ]);

    return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
};

export const useCurrentUser = (): CurrentUserContextType => useContext(CurrentUserContext);
