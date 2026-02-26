import {
	type FC,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { GlobalContext } from "@/contexts/Global";
import { SessionContext } from "@/contexts/Session";
import { SettingsContext } from "@/contexts/Settings";
import type { AuthResponse } from "@/shared/types/AuthResponse";
import type { LoginRequest } from "@/shared/types/LoginRequest";
import { getStoredUserSession, saveStoredUserSession } from "./sessionHelpers";

export const SessionProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { settings } = useContext(SettingsContext);
	const { makeApiRequest, makeApiRequestJson } = useContext(GlobalContext);

	const [session, setSession] = useState(getStoredUserSession);

	const isRequesting = useRef(false);

	useEffect(() => saveStoredUserSession(session), [session]);

	const requestLogin = useCallback(
		async (code: string) => {
			const response = await makeApiRequestJson<AuthResponse>("/login", {
				method: "post",
				body: JSON.stringify({
					code,
					redirectUri: settings.redirectUri,
				} satisfies LoginRequest),
				headers: { accept: "application/json", "content-type": "application/json" },
			});

			if (response === null) return;

			setSession({
				user: response.user,
				steamConnections: response.steamConnections,
				expiresAt: new Date(Date.now() + response.expiresIn * 1000).toISOString(),
				token: response.token,
			});

			return;
		},
		[makeApiRequestJson, settings.redirectUri],
	);

	const requestRefresh = useCallback(async () => {
		if (session === null) return;

		const response = await makeApiRequestJson<AuthResponse>("/refresh", {
			method: "post",
			headers: { authorization: `Bearer ${session.token}`, accept: "application/json" },
		});

		if (response === null) return;

		setSession({
			user: response.user,
			steamConnections: response.steamConnections,
			expiresAt: new Date(Date.now() + response.expiresIn * 1000).toISOString(),
			token: response.token,
		});
	}, [session, makeApiRequestJson]);

	const requestLogout = useCallback(async () => {
		if (session === null) return;

		const response = await makeApiRequest("/logout", {
			method: "post",
			headers: { authorization: `Bearer ${session.token}` },
		});

		if (response === false) return;

		setSession(null);
	}, [makeApiRequest, session]);

	useEffect(() => {
		if (session === null || isRequesting.current) return;

		const secondsTillExpiry = Math.floor(
			(new Date(session.expiresAt).getTime() - Date.now()) / 1000,
		);

		if (secondsTillExpiry <= 0) {
			console.log("[SessionProvider] Session expired, logging out.");
			setSession(null);
			return;
		}

		if (secondsTillExpiry < settings.minRefreshSeconds) {
			console.log(
				`[SessionProvider] Session expires too soon to refresh (${secondsTillExpiry.toLocaleString()} < ${settings.minRefreshSeconds.toLocaleString()} seconds), logging out`,
			);
			setSession(null);
			return;
		}

		const minutesTillExpiry = Math.floor(secondsTillExpiry / 60);

		if (minutesTillExpiry > settings.maxRefreshMinutes) {
			console.log(
				`[SessionProvider] Session expires in ${minutesTillExpiry.toLocaleString()} minutes (${(minutesTillExpiry / 24).toLocaleString()} days), background refreshed scheduled`,
			);

			const timeout = setTimeout(requestRefresh, secondsTillExpiry * 1000);

			return () => {
				clearTimeout(timeout);
			};
		}

		console.log(
			`[SessionProvider] Session expires in ${minutesTillExpiry.toLocaleString()} minutes, attempting background refresh`,
		);

		isRequesting.current = true;

		requestRefresh()
			.catch(console.error)
			.finally(() => {
				isRequesting.current = false;
			});
	}, [session, requestRefresh, settings.maxRefreshMinutes, settings.minRefreshSeconds]);

	return (
		<SessionContext.Provider value={{ session, requestLogin, requestRefresh, requestLogout }}>
			{children}
		</SessionContext.Provider>
	);
};
