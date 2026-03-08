import { BrowserRouter } from "react-router";
import { BrowserSessionProvider } from "./BrowserSession/BrowserSessionContext";
import { CurrentUserProvider } from "./CurrentUser/CurrentUserContext";
import { PantheonApiProvider } from "./PantheonApi/PantheonApiContext";
import { SettingsProvider } from "./Settings/SettingsContext";
import { SteamUserCacheProvider } from "./SteamUserCache/SteamUserCacheContext";

export const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BrowserRouter>
        <SettingsProvider>
            <BrowserSessionProvider>
                <PantheonApiProvider>
                    <SteamUserCacheProvider>
                        <CurrentUserProvider>{children}</CurrentUserProvider>
                    </SteamUserCacheProvider>
                </PantheonApiProvider>
            </BrowserSessionProvider>
        </SettingsProvider>
    </BrowserRouter>
);
