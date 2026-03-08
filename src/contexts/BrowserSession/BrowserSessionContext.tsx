import { createContext, useContext, useMemo } from "react";
import { useSettings } from "../Settings/SettingsContext";
import type { BrowserSession } from "./BrowserSession";
import { generateBrowserState, makeAuthLink } from "./browserSessionHelpers";

const BrowserSessionContext = createContext<BrowserSession>({ state: "", oAuthLink: "" });

export const BrowserSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { discordClientId, redirectUri } = useSettings();

    const state = useMemo(generateBrowserState, []);

    const oAuthLink = useMemo(() => {
        return makeAuthLink(discordClientId, redirectUri, state);
    }, [discordClientId, redirectUri, state]);

    const value = useMemo<BrowserSession>(() => ({ state, oAuthLink }), [oAuthLink, state]);

    return (
        <BrowserSessionContext.Provider value={value}>{children}</BrowserSessionContext.Provider>
    );
};

export const useBrowserSession = (): BrowserSession => useContext(BrowserSessionContext);
