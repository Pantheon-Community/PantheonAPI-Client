import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { useCallback, useState } from "react";
import "./RefreshButton.css";

export const RefreshButton: React.FC = () => {
    const { currentUser, refresh } = useCurrentUser();

    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleClick = useCallback(async () => {
        setIsRefreshing(true);
        await refresh();
        setIsRefreshing(false);
    }, [refresh]);

    return (
        <button
            className="refresh-button"
            type="button"
            disabled={currentUser === null || isRefreshing}
            onClick={handleClick}
        >
            Refresh
        </button>
    );
};
