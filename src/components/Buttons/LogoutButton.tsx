import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { useCallback, useState } from "react";
import "./LogoutButton.css";

interface LogoutButtonProps {
    extraOnClick?: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ extraOnClick }) => {
    const { currentUser, logout } = useCurrentUser();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleClick = useCallback(async () => {
        setIsLoggingOut(true);
        await logout();
        setIsLoggingOut(false);
        extraOnClick?.();
    }, [logout, extraOnClick]);

    return (
        <button
            className="logout-button"
            type="button"
            disabled={currentUser === null || isLoggingOut}
            onClick={handleClick}
        >
            Logout
        </button>
    );
};
