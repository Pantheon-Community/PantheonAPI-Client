import { useCallback, useContext, useState } from "react";
import { SessionContext } from "@/contexts/Session";
import "./RefreshButton.css";

export const RefreshButton = () => {
	const { session, requestRefresh } = useContext(SessionContext);

	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleClick = useCallback(async () => {
		setIsRefreshing(true);
		await requestRefresh();
		setIsRefreshing(false);
	}, [requestRefresh]);

	return (
		<button
			className="refresh-button"
			type="button"
			disabled={session === null || isRefreshing}
			onClick={handleClick}
		>
			Refresh
		</button>
	);
};
