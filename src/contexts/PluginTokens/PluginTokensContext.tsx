import { BASE_STORAGE_KEY } from "@/constants/baseStorageKey";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { PluginToken, PluginTokenId, PluginTokenObject } from "@/shared/types/PluginToken";
import type { CheckPluginTokenRequest } from "@/shared/types/Requests/CheckPluginTokenRequest";
import type { PluginTokenRequest } from "@/shared/types/Requests/PluginTokenRequest";
import type { PostPluginTokenResponse } from "@/shared/types/Responses/MakePluginTokenResponse";
import { notImplementedFunction } from "@/utils/notImplementedFn";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useCurrentUser } from "../CurrentUser/CurrentUserContext";
import { usePantheonApi } from "../PantheonApi/PantheonApiContext";

interface PluginTokensContextType {
    readonly tokens: PluginTokenObject[];

    readonly tokenMap: ReadonlyMap<PluginTokenId, PluginTokenObject>;

    readonly shouldFetch: boolean;

    fetch(controller: AbortController): Promise<void>;

    create(payload: PluginTokenRequest): Promise<PostPluginTokenResponse | null>;

    update(id: PluginTokenId, payload: PluginTokenRequest): Promise<void>;

    deleteFn(id: PluginTokenId): Promise<void>;

    check(token: PluginToken): Promise<PluginTokenId | null>;
}

const KEY = `${BASE_STORAGE_KEY}.pluginTokens` as const;

const PluginTokensContext = createContext<PluginTokensContextType>({
    tokens: [],
    tokenMap: new Map(),
    shouldFetch: false,
    fetch: notImplementedFunction,
    create: notImplementedFunction,
    update: notImplementedFunction,
    deleteFn: notImplementedFunction,
    check: notImplementedFunction,
});

export const PluginTokensContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { makeRequest, makeJsonRequest } = usePantheonApi();
    const { currentUser } = useCurrentUser();

    const [tokens, setTokens] = useSessionStorage<PluginTokenObject[]>(KEY, JSON);

    const tokenMap = useMemo(() => {
        const output = new Map<PluginTokenId, PluginTokenObject>();

        if (tokens !== null) {
            for (const token of tokens) {
                output.set(token.id, token);
            }
        }

        return output;
    }, [tokens]);

    const shouldFetch = useMemo(() => tokens === null, [tokens]);

    const fetch = useCallback(
        async (controller: AbortController) => {
            if (currentUser?.token === undefined) return;

            const response = await makeJsonRequest<PluginTokenObject[]>("/plugins/tokens", {
                signal: controller.signal,
                headers: {
                    authorization: `Bearer ${currentUser.token}`,
                    accept: "application/json",
                },
            });

            if (response !== null) {
                setTokens(response);
            }
        },
        [makeJsonRequest, setTokens, currentUser?.token],
    );

    const create = useCallback(
        async (payload: PluginTokenRequest): Promise<PostPluginTokenResponse | null> => {
            if (currentUser?.token === undefined) {
                return null;
            }

            const response = await makeJsonRequest<PostPluginTokenResponse>("/plugins/tokens", {
                method: "POST",
                headers: {
                    authorization: `Bearer ${currentUser.token}`,
                    accept: "application/json",
                    "content-type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response !== null) {
                setTokens((prev) => {
                    const newPluginToken: PluginTokenObject = {
                        id: response.id,
                        label: payload.label,
                        timesUsed: 0,
                        lastUsedAt: new Date().toISOString(),
                        createdBy: currentUser.user.id,
                        createdAt: new Date().toISOString(),
                        lastUpdatedBy: currentUser.user.id,
                        lastUpdatedAt: new Date().toISOString(),
                    };

                    if (prev === null) {
                        return [newPluginToken];
                    }

                    return [...prev, newPluginToken];
                });
            }

            return response;
        },
        [currentUser?.user.id, makeJsonRequest, currentUser?.token, setTokens],
    );

    const update = useCallback(
        async (id: PluginTokenId, payload: PluginTokenRequest) => {
            if (currentUser?.token === undefined) {
                return;
            }

            const response = await makeRequest(`/plugins/tokens/${id}`, {
                method: "PATCH",
                headers: {
                    authorization: `Bearer ${currentUser.token}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response) {
                return;
            }

            setTokens((prev) => {
                if (prev === null) {
                    return null;
                }

                const idx = prev.findIndex((x) => x.id === id);

                if (idx === -1) {
                    return prev;
                }

                const newArr = [...prev];

                newArr[idx] = {
                    ...newArr[idx],
                    lastUpdatedAt: new Date().toISOString(),
                    lastUpdatedBy: currentUser.user.id,
                    ...payload,
                };

                return newArr;
            });
        },
        [setTokens, makeRequest, currentUser?.token, currentUser?.user.id],
    );

    const deleteFn = useCallback(
        async (id: PluginTokenId) => {
            if (currentUser?.token === undefined) {
                return;
            }

            const response = await makeRequest(`/plugins/tokens/${id}`, {
                method: "DELETE",
                headers: {
                    authorization: `Bearer ${currentUser.token}`,
                },
            });

            if (!response) {
                return;
            }

            setTokens((prev) => {
                if (prev === null) {
                    return null;
                }

                const idx = prev.findIndex((x) => x.id === id);

                if (idx === -1) {
                    return prev;
                }

                const newArr = [...prev];

                newArr.splice(idx, 1);

                return newArr;
            });
        },
        [setTokens, makeRequest, currentUser?.token],
    );

    const check = useCallback(
        async (token: PluginToken): Promise<PluginTokenId | null> => {
            if (currentUser?.token === undefined) {
                return null;
            }

            const response = await makeJsonRequest<PluginTokenObject>(
                `/plugins/tokens/check`,
                {
                    method: "POST",
                    headers: {
                        authorization: `Bearer ${currentUser.token}`,
                        accept: "application/json",
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({ token } satisfies CheckPluginTokenRequest),
                },
                { suppress404: true },
            );

            if (response === null) {
                return null;
            }

            return response.id;
        },
        [makeJsonRequest, currentUser?.token],
    );

    const value = useMemo<PluginTokensContextType>(
        () => ({
            tokens: tokens ?? [],
            tokenMap,
            shouldFetch,
            fetch,
            create,
            update,
            deleteFn,
            check,
        }),
        [tokens, check, fetch, create, tokenMap, update, deleteFn, shouldFetch],
    );

    return <PluginTokensContext.Provider value={value}>{children}</PluginTokensContext.Provider>;
};

export const usePluginTokens = (): PluginTokensContextType => useContext(PluginTokensContext);
