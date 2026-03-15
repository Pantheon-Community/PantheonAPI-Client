import { BrowserRouter } from "react-router";
import { CurrentUserProvider } from "./CurrentUser/CurrentUserContext";
import { PantheonApiProvider } from "./PantheonApi/PantheonApiContext";
import { SettingsProvider } from "./Settings/SettingsContext";
import { UserSessionsProvider } from "./UserSessions/UserSessionsContext";

export const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BrowserRouter>
        <SettingsProvider>
            <PantheonApiProvider>
                <CurrentUserProvider>
                    <UserSessionsProvider>{children}</UserSessionsProvider>
                </CurrentUserProvider>
            </PantheonApiProvider>
        </SettingsProvider>
    </BrowserRouter>
);
