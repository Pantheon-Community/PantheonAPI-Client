export interface Settings {
    readonly serverUrl: string;

    readonly discordClientId: string;

    readonly redirectUri: string;

    readonly maxRefreshMinutes: number;

    readonly minRefreshSeconds: number;
}
