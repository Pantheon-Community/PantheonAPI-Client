import type { LoginRequest } from "@/shared/types/Requests/LoginRequest";
import type { AuthResponse } from "@/shared/types/Responses/AuthResponse";
import { notImplementedFunction } from "@/utils/notImplementedFn";
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
import { getStoredCurrentUser, saveStoredCurrentUser } from "./currentUserHelpers";

interface CurrentUserContextType {
    readonly currentUser: AuthResponse | null;

    setCurrentUser: React.Dispatch<React.SetStateAction<AuthResponse | null>>;

    login(code: string): Promise<boolean>;

    logout(): Promise<void>;

    refresh(): Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextType>({
    currentUser: null,
    setCurrentUser: notImplementedFunction,
    login: notImplementedFunction,
    logout: notImplementedFunction,
    refresh: notImplementedFunction,
});

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { redirectUri, minRefreshSeconds, maxRefreshMinutes } = useSettings();

    const { isRateLimited, makeRequest, makeJsonRequest } = usePantheonApi();

    const { pathname } = useLocation();

    const [currentUser, setCurrentUser] = useState(getStoredCurrentUser);

    useEffect(() => saveStoredCurrentUser(currentUser), [currentUser]);

    const isDoingSomething = useRef(false);

    /** Log silencing for developer sanity. */
    const lastLoggedAt = useRef(0);

    const isInSettings = useMemo(() => pathname === "/settings", [pathname]);

    const login = useCallback(
        async (code: string) => {
            if (isDoingSomething.current) return false;
            isDoingSomething.current = true;

            const response = await makeJsonRequest<AuthResponse>(
                "/login",
                {
                    method: "POST",
                    body: JSON.stringify({ code, redirectUri } satisfies LoginRequest),
                    headers: { accept: "application/json", "content-type": "application/json" },
                },
                { isAuthRelated: true },
            );

            isDoingSomething.current = false;

            if (response !== null) {
                setCurrentUser(response);
                return true;
            }

            return false;
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
                method: "POST",
                headers: { authorization: `Bearer ${currentUser.token}` },
            },
            { isAuthRelated: true },
        );

        isDoingSomething.current = false;

        setCurrentUser(null);
    }, [currentUser?.token, makeRequest]);

    const refresh = useCallback(async () => {
        if (currentUser?.token === undefined) return;

        if (isDoingSomething.current) return;
        isDoingSomething.current = true;

        const response = await makeJsonRequest<AuthResponse>(
            "/refresh",
            {
                method: "POST",
                headers: {
                    authorization: `Bearer ${currentUser.token}`,
                    accept: "application/json",
                },
            },
            { isAuthRelated: true },
        );

        isDoingSomething.current = false;

        if (response !== null) {
            setCurrentUser(response);
        }
    }, [currentUser?.token, makeJsonRequest]);

    useEffect(() => {
        // background auto refresh

        if (currentUser?.expiresAt === undefined) return;
        if (isInSettings) return;
        if (isRateLimited) return;

        const expirationTime = duration(new Date(currentUser.expiresAt).getTime());

        const secondsTillExpiry = Math.floor(
            (new Date(currentUser.expiresAt).getTime() - Date.now()) / 1000,
        );

        if (secondsTillExpiry < minRefreshSeconds) {
            // expired
            console.log(`[SessionProvider] Session expired ${expirationTime} ago, logging out`);
            setCurrentUser(null);
            return;
        }

        if (secondsTillExpiry < minRefreshSeconds) {
            // too soon
            console.log(
                `[SessionProvider] Session expires too soon to refresh (${expirationTime} ago), logging out`,
            );
            setCurrentUser(null);
            return;
        }

        const minutesTillExpiry = Math.floor(secondsTillExpiry / 60);

        if (minutesTillExpiry <= maxRefreshMinutes) {
            // close enough
            console.log(
                `[SessionProvider] Session expires in ${expirationTime}, attempting background refresh`,
            );

            void refresh();
            return;
        }

        // not close enough

        const delay = 1000 * 60 * (minutesTillExpiry - maxRefreshMinutes);

        const scheduledAt = duration(Date.now() + delay);

        const timeout = setTimeout(refresh, delay);

        if (Date.now() >= lastLoggedAt.current) {
            console.log(
                `[SessionProvider] Session expires in ${expirationTime}, background refreshed scheduled in ${scheduledAt}`,
            );

            lastLoggedAt.current = Date.now() + 1000 * 60 * 5;
        }

        return () => clearTimeout(timeout);
    }, [
        isRateLimited,
        refresh,
        minRefreshSeconds,
        currentUser?.expiresAt,
        isInSettings,
        maxRefreshMinutes,
    ]);

    const value = useMemo<CurrentUserContextType>(() => {
        return { currentUser, setCurrentUser, login, logout, refresh };
    }, [currentUser, logout, login, refresh]);

    return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
};

export const useCurrentUser = (): CurrentUserContextType => useContext(CurrentUserContext);
