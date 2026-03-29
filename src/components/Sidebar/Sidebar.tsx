import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { InternalLink } from "../Links/InternalLink/InternalLink";
import { ProfilePicture } from "../ProfilePicture/ProfilePicture";
import "./Sidebar.css";

declare global {
    interface Window {
        GIT_COMMIT_HASH?: string;
    }
}

export const Sidebar: React.FC = () => {
    const { currentUser } = useCurrentUser();

    return (
        <div className="sidebar">
            <h4>Pantheon Dev</h4>

            <nav>
                <InternalLink href="/">Home</InternalLink>

                {currentUser !== null && (
                    <InternalLink href="/profile">
                        <span>Profile</span>

                        <ProfilePicture
                            id={currentUser.user.id}
                            username={currentUser.user.username}
                            avatar={currentUser.user.avatar}
                            size={32}
                        />
                    </InternalLink>
                )}

                <InternalLink href="/roles">Roles</InternalLink>

                <InternalLink href="/settings">Settings</InternalLink>

                <InternalLink href="/components">Components</InternalLink>
            </nav>

            {!!window.GIT_COMMIT_HASH && (
                <div className="version" title="Git Commit Hash">
                    {window.GIT_COMMIT_HASH}
                </div>
            )}
        </div>
    );
};
