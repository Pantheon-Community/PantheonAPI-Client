import { baseKey } from "../utils";

const KEY = `${baseKey}.browser-session`;

export function generateBrowserState(): string {
	let state = sessionStorage.getItem(KEY);

	if (state !== null) return state;

	// generate new pseudorandom state, not cryptographically secure, but better than nothing
	state = new Array(32)
		.fill(0)
		.map(() => Math.floor(Math.random() * 16).toString(16))
		.join("");

	sessionStorage.setItem(KEY, state);

	return state;
}

export function makeAuthLink(clientId: string, redirectUri: string, state: string) {
	const linkParams = new URLSearchParams([
		["response_type", "code"],
		["client_id", clientId],
		["state", state],
		["redirect_uri", redirectUri],
		["scope", "identify+connections"],
	]);

	return `https://discord.com/oauth2/authorize?${linkParams.toString()}`;
}
