import { GeneralPermissions } from "@/shared/types/Permissions/GeneralPermissions";
import { useMemo } from "react";
import { Route, Routes } from "react-router";
import { WrappedErrorDialog } from "./components/Dialogs/ErrorDialog/ErrorDialog";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { AllProviders } from "./contexts/AllProviders";
import { usePermissions } from "./contexts/Permissions/PermissionsContext";
import "./index.css";
import { ComponentsPage } from "./pages/ComponentsPage/ComponentsPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { RolesPage } from "./pages/RolesPage/RolesPage";
import { SettingsPage } from "./pages/SettingsPage/SettingsPage";
import { TokensPage } from "./pages/TokensPage/TokensPage";

const homePage = <HomePage />;
const settingsPage = <SettingsPage />;
const loginPage = <LoginPage />;
const profilePage = <ProfilePage />;
const rolesPage = <RolesPage />;
const componentsPage = <ComponentsPage />;
const tokensPage = <TokensPage />;
const notFoundPage = <NotFoundPage />;

const AppRoutes: React.FC = () => {
    const { hasPermission } = usePermissions();

    const canSeeTokensPage = useMemo(() => {
        return hasPermission({ generalPermissions: GeneralPermissions.EditTokens });
    }, [hasPermission]);

    return (
        <Routes>
            <Route path="/" element={homePage} />
            <Route path="/settings" element={settingsPage} />
            <Route path="/login" element={loginPage} />
            <Route path="/profile" element={profilePage} />
            <Route path="/roles" element={rolesPage} />
            <Route path="/components" element={componentsPage} />
            {canSeeTokensPage && <Route path="/tokens" element={tokensPage} />}
            <Route path="*" element={notFoundPage} />
        </Routes>
    );
};

export const App: React.FC = () => (
    <AllProviders>
        <WrappedErrorDialog />
        <Sidebar />
        <main>
            <AppRoutes />
        </main>
    </AllProviders>
);
