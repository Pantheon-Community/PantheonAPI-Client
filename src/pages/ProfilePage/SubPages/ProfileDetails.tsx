import { CopyTextButton } from "@/components/Buttons/CopyTextButton";
import { LogoutButton } from "@/components/Buttons/LogoutButton";
import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { ProfilePicture } from "@/components/ProfilePicture/ProfilePicture";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import type { AuthResponse } from "@/shared/types/Responses/AuthResponse";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./ProfileDetails.css";

export const ProfileDetails: React.FC<{ currentUser: AuthResponse }> = ({ currentUser }) => {
    const { refreshUser } = useCurrentUser();
    const [isShowingExtra, setIsShowingExtra] = useState(false);

    const handleToggle = useCallback((e: React.ToggleEvent<HTMLDetailsElement>) => {
        setIsShowingExtra(e.newState === "open");
    }, []);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const [justDidRefresh, setJustDidRefresh] = useState(false);

    useEffect(() => {
        if (!justDidRefresh) return;

        const timeout = setTimeout(setJustDidRefresh, 3_000, false);

        return () => clearTimeout(timeout);
    }, [justDidRefresh]);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);

        await refreshUser();
        setJustDidRefresh(true);

        setIsRefreshing(false);
    }, [refreshUser]);

    const refreshButtonText = useMemo(() => {
        if (isRefreshing) return "Refreshing...";
        if (justDidRefresh) return "Refreshed!";
        return "Refresh";
    }, [justDidRefresh, isRefreshing]);

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

                    <button
                        className="refresh-button"
                        type="button"
                        disabled={isRefreshing || justDidRefresh}
                        onClick={handleRefresh}
                    >
                        {refreshButtonText}
                    </button>
                </div>
            </div>

            <details open={isShowingExtra} onToggle={handleToggle}>
                <summary>{isShowingExtra ? "Hide" : "Show"} Raw Data</summary>

                <CodeBlock>{currentUser}</CodeBlock>
            </details>
        </div>
    );
};
