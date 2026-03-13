import type { Settings } from "@/contexts/Settings/Settings";
import { defaultSettings } from "@/contexts/Settings/settingsDefaults";
import { notImplementedFunction } from "@/utils/notImplementedFn";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getStoredSettings, saveStoredSettings } from "./settingsHelpers";

interface SettingsContextType {
    readonly settings: Settings;

    setValue<K extends keyof Settings>(key: K, value: Settings[K]): void;

    resetValue<K extends keyof Settings>(key: K): void;
}

const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    setValue: notImplementedFunction,
    resetValue: notImplementedFunction,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState(getStoredSettings);

    useEffect(() => saveStoredSettings(settings), [settings]);

    const setValue = useCallback<SettingsContextType["setValue"]>((k, v) => {
        setSettings((prev) => ({ ...prev, [k]: v }));
    }, []);

    const resetValue = useCallback<SettingsContextType["resetValue"]>((k) => {
        setSettings((prev) => ({ ...prev, [k]: defaultSettings[k] }));
    }, []);

    const value = useMemo<SettingsContextType>(() => {
        return { settings, setValue, resetValue };
    }, [resetValue, settings, setValue]);

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): Settings => useContext(SettingsContext).settings;

export const useSettingsFull = (): SettingsContextType => useContext(SettingsContext);
