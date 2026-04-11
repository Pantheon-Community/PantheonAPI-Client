import { StatefulButton } from "@/components/Buttons/StatefulButton/StatefulButton";
import { SteamUserCard } from "@/components/SteamUserCard/SteamUserCard";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { usePantheonApi } from "@/contexts/PantheonApi/PantheonApiContext";
import { usePermissions } from "@/contexts/Permissions/PermissionsContext";
import { UserPermissions } from "@/shared/types/Permissions/UserPermissions";
import type { AuthResponse } from "@/shared/types/Responses/AuthResponse";
import type { SteamUser } from "@/shared/types/SteamUser";
import { useCallback, useMemo } from "react";
import "./ProfileConnections.css";

export const ProfileConnections: React.FC<{ currentUser: AuthResponse }> = ({ currentUser }) => {
    const { makeRequest, makeJsonRequest } = usePantheonApi();

    const { setCurrentUser } = useCurrentUser();
    const { hasPermission } = usePermissions();

    const mainConnection = useMemo(() => {
        if (currentUser.user.steamId === null) {
            return null;
        }

        return currentUser.steamUsers.find((x) => x.id === currentUser.user.steamId) ?? null;
    }, [currentUser.user.steamId, currentUser.steamUsers]);

    const canClearMainConnection = useMemo(() => {
        if (!hasPermission({ userPermissions: UserPermissions.DeletePrimaryConnection })) {
            return false;
        }

        return !!mainConnection;
    }, [hasPermission, mainConnection]);

    const connections = currentUser.steamUsers;

    const makeSelectHandler = useCallback(
        (steam: SteamUser) => {
            return async () => {
                const response = await makeRequest(`/users/@me/steam-users/primary/${steam.id}`, {
                    method: "PUT",
                    headers: { authorization: `Bearer ${currentUser.token}` },
                });

                if (response) {
                    setCurrentUser((prev) => {
                        if (prev === null) return null;
                        return { ...prev, user: { ...prev.user, steamId: steam.id } };
                    });
                }
            };
        },
        [makeRequest, currentUser.token, setCurrentUser],
    );

    const clearPrimaryConnection = useCallback(async () => {
        const response = await makeRequest("/users/@me/steam-users/primary", {
            method: "DELETE",
            headers: { authorization: `Bearer ${currentUser.token}` },
        });

        if (response) {
            setCurrentUser((prev) => {
                if (prev === null) return null;
                return { ...prev, user: { ...prev.user, steamId: null } };
            });
        }
    }, [currentUser.token, setCurrentUser, makeRequest]);

    const refreshUserConnections = useCallback(async () => {
        const response = await makeJsonRequest<SteamUser[]>("/users/@me/steam-users", {
            headers: {
                authorization: `Bearer ${currentUser.token}`,
                accept: "application/json",
            },
        });

        if (response !== null) {
            setCurrentUser((prev) => {
                if (prev === null) return null;

                return { ...prev, steamUsers: response };
            });
        }
    }, [makeJsonRequest, currentUser.token, setCurrentUser]);

    return (
        <div className="profile-connections">
            <h3>
                <span>Primary Connection</span>

                {canClearMainConnection && (
                    <StatefulButton
                        onClick={clearPrimaryConnection}
                        textDo="Clear"
                        textDoing="Clearing..."
                        textDone="Cleared!"
                    />
                )}
            </h3>

            <p>Your primary Steam connection is what we use to identify you in-game.</p>

            {mainConnection ? (
                <SteamUserCard user={mainConnection} isPrimary />
            ) : (
                <p className="bad">
                    <b>No Primary Steam Connection</b>
                    <br />
                    <br />
                    Without a primary Steam connection, you won't be able to interact with most of
                    the site.
                </p>
            )}

            <h3>
                <span>All Connections</span>

                <StatefulButton
                    onClick={refreshUserConnections}
                    textDo="Refresh"
                    textDoing="Refreshing..."
                    textDone="Refreshed!"
                />
            </h3>

            <p>These are all the Steam connections that are linked to your Discord account.</p>

            {connections.length === 0 ? (
                <p className="bad">
                    <b>No Steam Connections</b>
                    <br />
                    <br />
                    No Steam connections could be found, try adding them via Discord and then
                    pressing refresh.
                </p>
            ) : (
                <div className="all-connections">
                    {connections.map((connection) => (
                        <SteamUserCard
                            user={connection}
                            isPrimary={connection.id === mainConnection?.id}
                            onClickButton={makeSelectHandler(connection)}
                            key={connection.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
