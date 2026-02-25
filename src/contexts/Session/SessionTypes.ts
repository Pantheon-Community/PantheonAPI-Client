import type { IsoString, UserToken } from "@/shared/types/Common";
import type { SteamConnection } from "@/shared/types/SteamConnection";
import type { User } from "@/shared/types/User";

export interface UserSession {
	readonly user: User;

	readonly steamConnections: SteamConnection[];

	readonly expiresAt: IsoString;

	readonly token: UserToken;
}

export interface SessionContextType {
	readonly session: UserSession | null;

	requestLogin(code: string): Promise<void>;

	requestRefresh(): Promise<void>;

	requestLogout(): Promise<void>;
}
