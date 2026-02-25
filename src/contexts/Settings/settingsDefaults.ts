import { notImplementedFunction } from "../notImplementedFunction";
import type { Settings, SettingsContextType } from "./SettingsTypes";

function defaultServerUrl() {
	if (window.location.hostname === "localhost") {
		const serverUrl = new URL(window.origin);

		serverUrl.port = "5000";

		return serverUrl.toString().slice(0, -1); // remove trailing "/"
	}

	return "https://api.pantheoncommunity.org";
}

export const defaultSettings: Settings = {
	serverUrl: defaultServerUrl(),
	discordClientId: "1475282311980253234",
	redirectUri: `${window.origin}/login`,
	maxRefreshMinutes: 3 * 24 * 60, // 3 days
	minRefreshSeconds: 30,
};

export const defaultSettingsContext: SettingsContextType = {
	settings: defaultSettings,
	setValue: notImplementedFunction,
	resetValue: notImplementedFunction,
	sessionData: { state: "", oAuthLink: "" },
};
