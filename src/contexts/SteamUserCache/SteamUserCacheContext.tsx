import type { SteamId64 } from "@/shared/types/Common";
import type { SteamUserInfo } from "@/shared/types/SteamUserInfo";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePantheonApi } from "../PantheonApi/PantheonApiContext";
import { useSettings } from "../Settings/SettingsContext";
import { notImplementedFunction } from "../utils";
import type { CachedSteamUserInfo } from "./SteamUserCache";
import { getStoredSteamUserCache, saveStoredSteamUserCache } from "./steamUserCacheHelpers";

export type SteamUserCache = (id: SteamId64) => Promise<SteamUserInfo>;

const SteamUserCacheContext = createContext<SteamUserCache>(notImplementedFunction);

export const SteamUserCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { cacheRetentionPeriodHours } = useSettings();
    const { makeJsonRequest } = usePantheonApi();

    const [cache, setCache] = useState(() => getStoredSteamUserCache(cacheRetentionPeriodHours));

    const outgoing = useRef(new Map<SteamId64, Promise<SteamUserInfo>>());

    useEffect(() => saveStoredSteamUserCache(cache), [cache]);

    const request = useCallback(
        (id: SteamId64): Promise<SteamUserInfo> => {
            const inCache = cache.get(id);

            if (inCache !== undefined) {
                return Promise.resolve(inCache.data);
            }

            const inOutgoing = outgoing.current.get(id);

            if (inOutgoing) {
                return inOutgoing;
            }

            const promise = new Promise<SteamUserInfo>((resolve) => {
                void makeJsonRequest<SteamUserInfo>(`/lookup/steam-users/${id}`).then((data) => {
                    if (data === null) {
                        data = { avatarFull: null, location: null, memberSince: null };
                    }

                    const payload: CachedSteamUserInfo = { data, cachedAt: Date.now() };

                    setCache((prev) => new Map(prev).set(id, payload));

                    resolve(data);
                });
            });

            outgoing.current.set(id, promise);

            return promise;
        },
        [cache, makeJsonRequest],
    );

    return (
        <SteamUserCacheContext.Provider value={request}>{children}</SteamUserCacheContext.Provider>
    );
};

export function useSteamUserInfo(id: SteamId64): SteamUserInfo | null {
    const request = useContext(SteamUserCacheContext);

    const [data, setData] = useState<SteamUserInfo | null>(null);

    useEffect(() => {
        request(id)
            .then((result) => {
                setData(result);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id, request]);

    return data;
}
