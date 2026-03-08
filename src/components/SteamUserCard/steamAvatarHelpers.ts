import type { SteamId64 } from "@/shared/types/Common";

async function fetchAvatar(id: SteamId64): Promise<string | null> {
    const data = await fetch(`https://steamcommunity.com/profiles/${id}/?xml=1`);

    const raw = await data.text();

    const parser = new DOMParser();

    const virtualDoc = parser.parseFromString(raw, "text/html");

    return virtualDoc.querySelector("avatarFull")?.textContent || null;
}

const cache = new Map<SteamId64, string | Promise<string | null>>();

export function getSteamAvatar(id: SteamId64): string | Promise<string | null> {
    const inCache = cache.get(id);

    if (inCache !== undefined) {
        return inCache;
    }

    const asPromise = fetchAvatar(id);

    cache.set(id, asPromise);

    return asPromise;
}
