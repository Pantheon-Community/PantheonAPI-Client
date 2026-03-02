import {
	createContext,
	type FC,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import type { Settings } from "@/contexts/Settings/Settings";
import { defaultSettings } from "@/contexts/Settings/settingsDefaults";
import { notImplementedFunction } from "../utils";
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

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [settings, setSettings] = useState(getStoredSettings);

	useEffect(() => saveStoredSettings(settings), [settings]);

	const setValue = useCallback<SettingsContextType["setValue"]>((k, v) => {
		setSettings((prev) => ({ ...prev, [k]: v }));
	}, []);

	const resetValue = useCallback<SettingsContextType["resetValue"]>((k) => {
		setSettings((prev) => ({ ...prev, [k]: defaultSettings[k] }));
	}, []);

	return (
		<SettingsContext.Provider value={{ settings, setValue, resetValue }}>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = () => useContext(SettingsContext).settings;

export const useSettingsFull = () => useContext(SettingsContext);
