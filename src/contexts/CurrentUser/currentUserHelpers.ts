import type { AuthResponse } from "@/shared/types/AuthResponse";
import { baseKey } from "../utils";

const KEY = `${baseKey}.current-user"`;

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
