import dayjs, { extend } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
	createContext,
	type FC,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import type { AuthResponse } from "@/shared/types/AuthResponse";
import type { LoginRequest } from "@/shared/types/LoginRequest";
import { usePantheonApi } from "../PantheonApi/PantheonApiContext";
import { useSettings } from "../Settings/SettingsContext";
import { notImplementedFunctionAsync } from "../utils";
import { getStoredCurrentUser, saveStoredCurrentUser } from "./currentUserHelpers";

extend(relativeTime);

interface CurrentUserContextType {
	readonly currentUser: AuthResponse | null;

	login(code: string): Promise<void>;

	logout(): Promise<void>;

	refresh(): Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextType>({
	currentUser: null,
	login: notImplementedFunctionAsync,
	logout: notImplementedFunctionAsync,
	refresh: notImplementedFunctionAsync,
});

export const CurrentUserProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { redirectUri, minRefreshSeconds, maxRefreshMinutes } = useSettings();
	const { makeRequest, makeJsonRequest } = usePantheonApi();

	const [currentUser, setCurrentUser] = useState(getStoredCurrentUser);

	useEffect(() => saveStoredCurrentUser(currentUser), [currentUser]);

	const isDoingSomething = useRef(false);

	const lastLoggedAt = useRef(0);

	const login = useCallback(
		async (code: string) => {
			if (isDoingSomething.current) return;
			isDoingSomething.current = true;

			const response = await makeJsonRequest<AuthResponse>("/login", {
				method: "post",
				body: JSON.stringify({ code, redirectUri } satisfies LoginRequest),
				headers: { accept: "application/json", "content-type": "application/json" },
			});

			isDoingSomething.current = false;

			if (response !== null) {
				setCurrentUser(response);
			}
		},
		[makeJsonRequest, redirectUri],
	);

	const logout = useCallback(async () => {
		if (currentUser?.token === undefined) return;

		if (isDoingSomething.current) return;
		isDoingSomething.current = true;

		await makeRequest("/logout", {
			method: "post",
			headers: { authorization: `Bearer ${currentUser.token}` },
		});

		isDoingSomething.current = false;

		setCurrentUser(null);
	}, [currentUser?.token, makeRequest]);

	const refresh = useCallback(async () => {
		if (currentUser?.token === undefined) return;

		if (isDoingSomething.current) return;
		isDoingSomething.current = true;

		const response = await makeJsonRequest<AuthResponse>("/logout", {
			method: "post",
			headers: {
				authorization: `Bearer ${currentUser.token}`,
				accept: "application/json",
			},
		});

		isDoingSomething.current = false;

		if (response !== null) {
			setCurrentUser(response);
		}
	}, [currentUser?.token, makeJsonRequest]);

	useEffect(() => {
		if (currentUser === null) return;

		const expirationTime = dayjs(currentUser.expiresAt).fromNow();

		const secondsTillExpiry = Math.floor(
			(new Date(currentUser.expiresAt).getTime() - Date.now()) / 1000,
		);

		if (secondsTillExpiry < minRefreshSeconds) {
			console.log(`[SessionProvider] Session expired ${expirationTime}, logging out`);
			setCurrentUser(null);
			return;
		}

		if (secondsTillExpiry < minRefreshSeconds) {
			console.log(
				`[SessionProvider] Session expires too soon to refresh (${expirationTime}, logging out`,
			);
			setCurrentUser(null);
			return;
		}

		const minutesTillExpiry = Math.floor(secondsTillExpiry / 60);

		if (minutesTillExpiry <= maxRefreshMinutes) {
			console.log(
				`[SessionProvider] Session expires ${expirationTime}, attempting background refresh`,
			);

			refresh().catch(console.error);
			return;
		}

		const delay = 1000 * 60 * (minutesTillExpiry - maxRefreshMinutes);

		const scheduledAt = dayjs(new Date(Date.now() + delay)).fromNow();

		const timeout = setTimeout(refresh, delay);

		if (Date.now() >= lastLoggedAt.current) {
			console.log(
				`[SessionProvider] Session expires ${expirationTime}, background refreshed scheduled ${scheduledAt}`,
			);

			lastLoggedAt.current = Date.now() + 1000 * 60 * 5;
		}

		return () => clearTimeout(timeout);
	}, [currentUser, maxRefreshMinutes, minRefreshSeconds, refresh]);

	return (
		<CurrentUserContext.Provider value={{ currentUser, login, logout, refresh }}>
			{children}
		</CurrentUserContext.Provider>
	);
};

export const useCurrentUser = () => useContext(CurrentUserContext);
