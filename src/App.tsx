import { Route, Routes } from "react-router";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SettingsPage } from "./pages/Settings/SettingsPage";
import { Providers } from "./providers/Providers";
import "./index.css";
import hljs from "highlight.js/lib/common";
import jsonLanguage from "highlight.js/lib/languages/json";
import "highlight.js/styles/atom-one-dark.css";

hljs.registerLanguage("json", jsonLanguage);

export const App = () => (
	<Providers>
		<Sidebar />

		<div className="app">
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/settings" element={<SettingsPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</div>
	</Providers>
);
