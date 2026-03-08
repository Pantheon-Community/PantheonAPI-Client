import type { SteamId64 } from "@/shared/types/Common";
import type { SteamUserInfo } from "@/shared/types/SteamUserInfo";

export interface CachedSteamUserInfo {
    data: SteamUserInfo;

    cachedAt: number;
}

export type SteamUserCache = Map<SteamId64, CachedSteamUserInfo>;
