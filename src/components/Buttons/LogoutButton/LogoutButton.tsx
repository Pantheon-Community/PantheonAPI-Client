import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { useCallback } from "react";
import { StatefulButton } from "../StatefulButton/StatefulButton";
import "./LogoutButton.css";

export const LogoutButton: React.FC<{ extraOnClick?(): void }> = ({ extraOnClick }) => {
    const { currentUser, logout } = useCurrentUser();

    const handleClick = useCallback(async () => {
        await logout();
        extraOnClick?.();
    }, [logout, extraOnClick]);

    return (
        <StatefulButton
            className="logout-button"
            type="button"
            disabled={currentUser === null}
            onClick={handleClick}
            textDo="Logout"
            textDoing="Logging out..."
            textDone="Logged out!"
        />
    );
};
