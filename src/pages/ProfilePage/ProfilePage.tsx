import { LoginButton } from "@/components/Buttons/LoginButton";
import { LogoutButton } from "@/components/Buttons/LogoutButton";
import { RefreshButton } from "@/components/Buttons/RefreshButton";
import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { useCallback, useState } from "react";
import "./ProfilePage.css";

export const ProfilePage: React.FC = () => {
    const { currentUser } = useCurrentUser();

    const [isShowingExtra, setIsShowingExtra] = useState(false);

    const handleToggle = useCallback((e: React.ToggleEvent<HTMLDetailsElement>) => {
        setIsShowingExtra(e.newState === "open");
    }, []);

    if (currentUser === null)
        return (
            <section>
                <h1>Not Logged In</h1>

                <p>You need to be logged in to view your profile.</p>

                <LoginButton />
            </section>
        );

    return (
        <section className="profile-page">
            <h1>{currentUser.user.username}</h1>

            <p>What a beautiful profile.</p>

            <div className="profile-buttons">
                <LogoutButton />

                <RefreshButton />
            </div>

            <details open={isShowingExtra} onToggle={handleToggle}>
                <summary>{isShowingExtra ? "Hide" : "Show"} Raw Data</summary>

                <CodeBlock>{currentUser}</CodeBlock>
            </details>
        </section>
    );
};
