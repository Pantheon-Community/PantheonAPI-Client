import { useCallback, useState } from "react";
import "./LogoutButton.css";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";

export const LogoutButton = () => {
	const { currentUser, logout } = useCurrentUser();

	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleClick = useCallback(async () => {
		setIsLoggingOut(true);
		await logout();
		setIsLoggingOut(false);
	}, [logout]);

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
