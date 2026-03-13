import { Route, Routes } from "react-router";
import { WrappedErrorDialog } from "./components/Dialogs/ErrorDialog/ErrorDialog";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { AllProviders } from "./contexts/AllProviders";
import "./index.css";
import { ComponentsPage } from "./pages/ComponentsPage/ComponentsPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage/SettingsPage";

const homePage = <HomePage />;
const settingsPage = <SettingsPage />;
const loginPage = <LoginPage />;
const profilePage = <ProfilePage />;
const componentsPage = <ComponentsPage />;
const notFoundPage = <NotFoundPage />;

export const App: React.FC = () => (
    <AllProviders>
        <WrappedErrorDialog />
        <Sidebar />

        <main>
            <Routes>
                <Route path="/" element={homePage} />
                <Route path="/settings" element={settingsPage} />
                <Route path="/login" element={loginPage} />
                <Route path="/profile" element={profilePage} />
                <Route path="/components" element={componentsPage} />
                <Route path="*" element={notFoundPage} />
            </Routes>
        </main>
    </AllProviders>
);
