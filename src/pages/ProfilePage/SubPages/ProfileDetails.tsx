import { CopyTextButton } from "@/components/Buttons/CopyTextButton";
import { LogoutButton } from "@/components/Buttons/LogoutButton";
import { StatefulButton } from "@/components/Buttons/StatefulButton";
import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { ProfilePicture } from "@/components/ProfilePicture/ProfilePicture";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import type { AuthResponse } from "@/shared/types/Responses/AuthResponse";
import { useCallback, useState } from "react";
import "./ProfileDetails.css";

export const ProfileDetails: React.FC<{ currentUser: AuthResponse }> = ({ currentUser }) => {
    const { refreshUser } = useCurrentUser();
    const [isShowingExtra, setIsShowingExtra] = useState(false);

    const handleToggle = useCallback((e: React.ToggleEvent<HTMLDetailsElement>) => {
        setIsShowingExtra(e.newState === "open");
    }, []);

    return (
        <div className="profile-details">
            <div className="summary">
                <ProfilePicture
                    id={currentUser.user.id}
                    username={currentUser.user.username}
                    avatar={currentUser.user.avatar}
                    size={128}
                />

                <p>What a beautiful profile.</p>

                <p className="discord-id">
                    <span>Discord ID {currentUser.user.id}</span>
                    <CopyTextButton text={currentUser.user.id} />
                </p>

                <div className="profile-buttons">
                    <LogoutButton />

                    <StatefulButton
                        className="refresh-button"
                        type="button"
                        onClick={refreshUser}
                        textDo="Refresh"
                        textDoing="Refreshing..."
                        textDone="Refreshed!"
                    />
                </div>
            </div>

            <details open={isShowingExtra} onToggle={handleToggle}>
                <summary>{isShowingExtra ? "Hide" : "Show"} Raw Data</summary>

                <CodeBlock>{currentUser}</CodeBlock>
            </details>
        </div>
    );
};
