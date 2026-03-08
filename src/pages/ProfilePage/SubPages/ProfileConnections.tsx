import { SteamUserCard } from "@/components/SteamUserCard/SteamUserCard";
import type { AuthResponse } from "@/shared/types/Responses/AuthResponse";
import "./ProfileConnections.css";

export const ProfileConnections: React.FC<{ currentUser: AuthResponse }> = ({ currentUser }) => {
    const mainConnection = currentUser.user.steam;
    const connections = currentUser.steamUsers;

    return (
        <div className="profile-connections">
            <p>Select a primary Steam account to associate yourself with.</p>

            {!!mainConnection && <SteamUserCard user={mainConnection} />}

            <p>Other Connections ({connections.length}):</p>

            <div className="all-connections">
                {connections.map((connection) => (
                    <SteamUserCard user={connection} key={connection.id} />
                ))}
            </div>
        </div>
    );
};
