import { useCallback, useContext, useState } from "react";
import { SessionContext } from "@/contexts/Session";
import "./LogoutButton.css";

export const LogoutButton = () => {
	const { session, requestLogout } = useContext(SessionContext);

	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleClick = useCallback(async () => {
		setIsLoggingOut(true);
		await requestLogout();
		setIsLoggingOut(false);
	}, [requestLogout]);

	return (
		<button
			className="logout-button"
			type="button"
			disabled={session === null || isLoggingOut}
			onClick={handleClick}
		>
			Logout
		</button>
	);
};
