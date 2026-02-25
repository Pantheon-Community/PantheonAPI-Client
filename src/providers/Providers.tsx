import type { FC, ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { SettingsProvider } from "./Settings/SettingsProvider";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => (
	<BrowserRouter>
		<SettingsProvider>{children}</SettingsProvider>
	</BrowserRouter>
);
