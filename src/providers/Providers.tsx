import type { FC, ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { GlobalProvider } from "./Global/GlobalProvider";
import { SessionProvider } from "./Session/SessionProvider";
import { SettingsProvider } from "./Settings/SettingsProvider";

export const Providers: FC<{ children: ReactNode }> = ({ children }) => (
	<BrowserRouter>
		<SettingsProvider>
			<GlobalProvider>
				<SessionProvider>{children}</SessionProvider>
			</GlobalProvider>
		</SettingsProvider>
	</BrowserRouter>
);
