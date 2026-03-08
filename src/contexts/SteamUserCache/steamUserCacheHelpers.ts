import type { SteamId64 } from "@/shared/types/Common";
import { baseKey } from "../utils";
import type { CachedSteamUserInfo, SteamUserCache } from "./SteamUserCache";

const KEY = `${baseKey}.steam-user-info`;

export function getStoredSteamUserCache(retentionHours: number): SteamUserCache {
    const output = new Map<SteamId64, CachedSteamUserInfo>();

    const existing = localStorage.getItem(KEY);

    if (existing !== null) {
        const asRecord: Record<SteamId64, CachedSteamUserInfo> = JSON.parse(existing);

        const evictThreshold = Date.now() - retentionHours * 60 * 60 * 1000;

        for (const [key, value] of Object.entries(asRecord)) {
            if (value.cachedAt > evictThreshold) {
                output.set(key as SteamId64, value);
            }
        }
    }

    return output;
}

export function saveStoredSteamUserCache(cache: SteamUserCache): void {
    if (cache.size === 0) {
        localStorage.removeItem(KEY);
    } else {
        const asRecord: Record<SteamId64, CachedSteamUserInfo> = {};

        for (const [key, value] of cache.entries()) {
            asRecord[key] = value;
        }

        localStorage.setItem(KEY, JSON.stringify(asRecord));
    }
}
