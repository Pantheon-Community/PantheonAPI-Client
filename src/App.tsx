import hljs from "highlight.js/lib/common";
import jsonLanguage from "highlight.js/lib/languages/json";
import "highlight.js/styles/atom-one-dark.css";
import { Route, Routes } from "react-router";
import { WrappedErrorDialog } from "./components/Dialogs/ErrorDialog";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { AllProviders } from "./contexts/AllProviders";
import "./index.css";
import { HomePage } from "./pages/HomePage/HomePage";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage/SettingsPage";

hljs.registerLanguage("json", jsonLanguage);

const homePage = <HomePage />;
const settingsPage = <SettingsPage />;
const loginPage = <LoginPage />;
const profilePage = <ProfilePage />;
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
                <Route path="*" element={notFoundPage} />
            </Routes>
        </main>
    </AllProviders>
);
