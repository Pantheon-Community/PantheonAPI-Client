import { createContext, type FC, type ReactNode, useContext, useMemo } from "react";
import { useSettings } from "../Settings/SettingsContext";
import type { BrowserSession } from "./BrowserSession";
import { generateBrowserState, makeAuthLink } from "./browserSessionHelpers";

const BrowserSessionContext = createContext<BrowserSession>({ state: "", oAuthLink: "" });

export const BrowserSessionProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { discordClientId, redirectUri } = useSettings();

	const state = useMemo(generateBrowserState, []);

	const oAuthLink = useMemo(
		() => makeAuthLink(discordClientId, redirectUri, state),
		[discordClientId, redirectUri, state],
	);

	return (
		<BrowserSessionContext.Provider value={{ state, oAuthLink }}>
			{children}
		</BrowserSessionContext.Provider>
	);
};

export const useBrowserSession = () => useContext(BrowserSessionContext);
