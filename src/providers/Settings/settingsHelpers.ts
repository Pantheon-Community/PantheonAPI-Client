import type { Settings, SettingsSessionData } from "@/contexts/Settings/SettingsTypes";
import { defaultSettings } from "@/contexts/Settings/settingsDefaults";

const KEY_SETTINGS = "PANTHEON_COMMUNITY_API_CLIENT.settings";
const KEY_SETTINGS_STATE = "PANTHEON_COMMUNITY_API_CLIENT.settings.state";

export function getStoredSettings(): Settings {
	const existing = localStorage.getItem(KEY_SETTINGS);

	if (existing === null) return defaultSettings;

	return { ...defaultSettings, ...JSON.parse(existing) };
}

export function saveStoredSettings(settings: Settings): void {
	const saved = {};

	for (const key of Object.keys(defaultSettings) as (keyof Settings)[]) {
		if (settings[key] !== defaultSettings[key]) {
			Object.defineProperty(saved, key, { value: settings[key], enumerable: true });
		}
	}

	if (Object.keys(saved).length > 0) {
		localStorage.setItem(KEY_SETTINGS, JSON.stringify(saved));
	} else {
		localStorage.removeItem(KEY_SETTINGS);
	}
}

export function generateSessionData(clientId: string, redirectUri: string): SettingsSessionData {
	let state = sessionStorage.getItem(KEY_SETTINGS_STATE);

	if (state === null) {
		// generate new pseudorandom state
		// not cryptographically secure, but better than nothing
		state = new Array(32)
			.fill(0)
			.map(() => Math.floor(Math.random() * 16).toString(16))
			.join("");

		sessionStorage.setItem(KEY_SETTINGS_STATE, state);
	}

	const linkParams = new URLSearchParams([
		["response_type", "code"],
		["client_id", clientId],
		["state", state],
		["redirect_uri", redirectUri],
		["scope", "identify+connections"],
	]);

	const oAuthLink = `https://discord.com/oauth2/authorize?${linkParams.toString()}`;

	return { state, oAuthLink };
}
