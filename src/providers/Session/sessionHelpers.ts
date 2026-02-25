import type { UserSession } from "@/contexts/Session/SessionTypes";

const KEY_SESSION = "PANTHEON_COMMUNITY_API_CLIENT.session";

export function getStoredUserSession(): UserSession | null {
	const existing = localStorage.getItem(KEY_SESSION);

	if (existing === null) return null;

	return JSON.parse(existing);
}

export function saveStoredUserSession(session: UserSession | null): void {
	if (session === null) {
		localStorage.removeItem(KEY_SESSION);
	} else {
		localStorage.setItem(KEY_SESSION, JSON.stringify(session));
	}
}
