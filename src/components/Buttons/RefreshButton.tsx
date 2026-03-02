import { useCallback, useState } from "react";
import "./RefreshButton.css";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";

export const RefreshButton = () => {
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
