import type { IsoString, UserToken } from "@/shared/types/Common";
import type { SteamUser } from "@/shared/types/SteamUser";
import type { User } from "@/shared/types/User";

export interface UserSession {
	readonly user: User;

	readonly steamUsers: SteamUser[];

	readonly expiresAt: IsoString;

	readonly token: UserToken;
}

export interface SessionContextType {
	readonly session: UserSession | null;

	requestLogin(code: string): Promise<void>;

	requestRefresh(): Promise<void>;

	requestLogout(): Promise<void>;
}
