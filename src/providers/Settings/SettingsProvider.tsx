import { type FC, type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { SettingsContext } from "@/contexts/Settings";
import type { SettingsContextType } from "@/contexts/Settings/SettingsTypes";
import { defaultSettings } from "@/contexts/Settings/settingsDefaults";
import { generateSessionData, getStoredSettings, saveStoredSettings } from "./SettingsHelpers";

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [settings, setSettings] = useState(getStoredSettings);

	const sessionData = useMemo(
		() => generateSessionData(settings.discordClientId, settings.redirectUri),
		[settings.discordClientId, settings.redirectUri],
	);

	useEffect(() => saveStoredSettings(settings), [settings]);

	const setValue = useCallback<SettingsContextType["setValue"]>((k, v) => {
		setSettings((prev) => ({ ...prev, [k]: v }));
	}, []);

	const resetValue = useCallback<SettingsContextType["resetValue"]>((k) => {
		setSettings((prev) => ({ ...prev, [k]: defaultSettings[k] }));
	}, []);

	return (
		<SettingsContext.Provider
			value={{
				settings,
				sessionData,
				setValue,
				resetValue,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};
