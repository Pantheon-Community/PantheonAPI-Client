import type { Settings } from "./Settings";

function defaultServerUrl(): string {
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
    cacheRetentionPeriodHours: 5 * 24, // 5 days
};
