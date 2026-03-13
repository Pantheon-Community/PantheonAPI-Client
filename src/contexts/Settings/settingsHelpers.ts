import { BASE_STORAGE_KEY } from "@/constants/baseStorageKey";
import type { Settings } from "./Settings";
import { defaultSettings } from "./settingsDefaults";

const KEY = `${BASE_STORAGE_KEY}.settings` as const;

export function getStoredSettings(): Settings {
    const existing = localStorage.getItem(KEY);

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
        localStorage.setItem(KEY, JSON.stringify(saved));
    } else {
        localStorage.removeItem(KEY);
    }
}
