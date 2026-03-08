import type { LoginRequest } from "@/shared/types/Requests/LoginRequest";
import type { AuthResponse } from "@/shared/types/Responses/AuthResponse";
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

    refresh(): Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextType>({
    currentUser: null,
    login: notImplementedFunctionAsync,
    logout: notImplementedFunctionAsync,
    refresh: notImplementedFunctionAsync,
});

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { redirectUri, minRefreshSeconds, maxRefreshMinutes } = useSettings();
    const { isRateLimited, makeRequest, makeJsonRequest } = usePantheonApi();

    const [currentUser, setCurrentUser] = useState(getStoredCurrentUser);

    useEffect(() => saveStoredCurrentUser(currentUser), [currentUser]);

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
                    method: "post",
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
                method: "post",
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
                    method: "post",
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
        };
    }, [currentUser, logout, login, refresh]);

    return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
};

export const useCurrentUser = (): CurrentUserContextType => useContext(CurrentUserContext);
