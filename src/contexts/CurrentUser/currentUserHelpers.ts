import { BASE_STORAGE_KEY } from "@/constants/baseStorageKey";
import type { AuthResponse } from "@/shared/types/Responses/AuthResponse";

const KEY = `${BASE_STORAGE_KEY}.current-user"` as const;

export function getStoredCurrentUser(): AuthResponse | null {
    const existing = localStorage.getItem(KEY);

    if (existing === null) return null;

    return JSON.parse(existing);
}

export function saveStoredCurrentUser(session: AuthResponse | null): void {
    if (session === null) {
        localStorage.removeItem(KEY);
    } else {
        localStorage.setItem(KEY, JSON.stringify(session));
    }
}
