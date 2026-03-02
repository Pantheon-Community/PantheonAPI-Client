import type { FC, ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { BrowserSessionProvider } from "./BrowserSession/BrowserSessionContext";
import { CurrentUserProvider } from "./CurrentUser/CurrentUserContext";
import { PantheonApiProvider } from "./PantheonApi/PantheonApiContext";
import { SettingsProvider } from "./Settings/SettingsContext";

export const AllProviders: FC<{ children: ReactNode }> = ({ children }) => (
	<BrowserRouter>
		<SettingsProvider>
			<BrowserSessionProvider>
				<PantheonApiProvider>
					<CurrentUserProvider>{children}</CurrentUserProvider>
				</PantheonApiProvider>
			</BrowserSessionProvider>
		</SettingsProvider>
	</BrowserRouter>
);
