import { BASE_STORAGE_KEY } from "@/constants/baseStorageKey";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { UserSessionId } from "@/shared/types/Common";
import type { UserSessionBasic } from "@/shared/types/UserSession";
import { notImplementedFunction } from "@/utils/notImplementedFn";
import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useCurrentUser } from "../CurrentUser/CurrentUserContext";
import { usePantheonApi } from "../PantheonApi/PantheonApiContext";

interface UserSessionsContextType {
    readonly userSessions: UserSessionBasic[] | null;

    fetch(controller?: AbortController): Promise<void>;

    deleteSession(id: UserSessionId): Promise<void>;
}

const KEY = `${BASE_STORAGE_KEY}.user-sessions` as const;

const UserSessionsContext = createContext<UserSessionsContextType>({
    userSessions: null,
    fetch: notImplementedFunction,
    deleteSession: notImplementedFunction,
});

export const UserSessionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { makeRequest, makeJsonRequest } = usePantheonApi();

    const { currentUser } = useCurrentUser();

    const [userSessions, setUserSessions] = useSessionStorage<UserSessionBasic[]>(KEY, JSON);

    const fetch = useCallback(
        async (controller?: AbortController) => {
            if (currentUser?.token === undefined) return;

            const response = await makeJsonRequest<UserSessionBasic[]>("/users/@me/sessions", {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${currentUser?.token}`,
                },
                signal: controller?.signal,
            });

            if (response !== null) {
                setUserSessions(response);
            }
        },
        [setUserSessions, makeJsonRequest, currentUser?.token],
    );

    const deleteSession = useCallback(
        async (id: UserSessionId) => {
            if (currentUser?.token === undefined) return;

            const response = await makeRequest(`/users/@me/sessions/${id}`, {
                method: "delete",
                headers: {
                    authorization: `Bearer ${currentUser.token}`,
                },
            });

            if (response) {
                setUserSessions((prev) => {
                    if (prev === null) {
                        return null;
                    }

                    const idx = prev.findIndex((x) => x.id === id);

                    if (idx !== -1) {
                        const newSessions = [...prev];
                        newSessions.splice(idx, 1);
                        return newSessions;
                    }

                    return prev;
                });
            }
        },
        [makeRequest, currentUser?.token, setUserSessions],
    );

    const value = useMemo<UserSessionsContextType>(
        () => ({
            userSessions,
            fetch,
            deleteSession,
        }),
        [userSessions, deleteSession, fetch],
    );

    useEffect(() => {
        if (currentUser === null) {
            setUserSessions(null);
        }
    }, [currentUser, setUserSessions]);

    return <UserSessionsContext.Provider value={value}>{children}</UserSessionsContext.Provider>;
};

export const useUserSessions = (): UserSessionsContextType => useContext(UserSessionsContext);
