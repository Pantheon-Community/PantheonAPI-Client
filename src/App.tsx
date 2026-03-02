import { Route, Routes } from "react-router";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { HomePage } from "./pages/HomePage/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { SettingsPage } from "./pages/SettingsPage/SettingsPage";
import "./index.css";
import hljs from "highlight.js/lib/common";
import jsonLanguage from "highlight.js/lib/languages/json";
import "highlight.js/styles/atom-one-dark.css";
import { AllProviders } from "./contexts/AllProviders";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";

hljs.registerLanguage("json", jsonLanguage);

export const App = () => (
	<AllProviders>
		<Sidebar />

		<main>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/settings" element={<SettingsPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</main>
	</AllProviders>
);
