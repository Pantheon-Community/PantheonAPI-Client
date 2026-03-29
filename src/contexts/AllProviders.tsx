import { BrowserRouter } from "react-router";
import { CurrentUserProvider } from "./CurrentUser/CurrentUserContext";
import { PantheonApiProvider } from "./PantheonApi/PantheonApiContext";
import { PermissionsContextProvider } from "./Permissions/PermissionsContext";
import { RolesContextProvider } from "./Roles/RolesContext";
import { SettingsProvider } from "./Settings/SettingsContext";
import { UserSessionsProvider } from "./UserSessions/UserSessionsContext";

export const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BrowserRouter>
        <SettingsProvider>
            <PantheonApiProvider>
                <CurrentUserProvider>
                    <UserSessionsProvider>
                        <RolesContextProvider>
                            <PermissionsContextProvider>{children}</PermissionsContextProvider>
                        </RolesContextProvider>
                    </UserSessionsProvider>
                </CurrentUserProvider>
            </PantheonApiProvider>
        </SettingsProvider>
    </BrowserRouter>
);
