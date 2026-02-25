export interface Settings {
	readonly serverUrl: string;

	readonly discordClientId: string;

	readonly redirectUri: string;

	readonly maxRefreshMinutes: number;

	readonly minRefreshSeconds: number;
}

export interface SettingsSessionData {
	readonly state: string;

	readonly oAuthLink: string;
}

export interface SettingsContextType {
	readonly settings: Settings;

	readonly sessionData: SettingsSessionData;

	setValue<K extends keyof Settings>(key: K, value: Settings[K]): void;

	resetValue<K extends keyof Settings>(key: K): void;
}
