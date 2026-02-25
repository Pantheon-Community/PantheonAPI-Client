import type { FC, ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { GlobalProvider } from "./Global/GlobalProvider";
import { SettingsProvider } from "./Settings/SettingsProvider";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => (
	<BrowserRouter>
		<SettingsProvider>
			<GlobalProvider>{children}</GlobalProvider>
		</SettingsProvider>
	</BrowserRouter>
);
