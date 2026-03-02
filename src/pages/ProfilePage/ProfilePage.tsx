import { useState } from "react";
import { LoginButton } from "@/components/Buttons/LoginButton";
import { LogoutButton } from "@/components/Buttons/LogoutButton";
import { RefreshButton } from "@/components/Buttons/RefreshButton";
import "./ProfilePage.css";
import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";

export const ProfilePage = () => {
	const { currentUser } = useCurrentUser();

	const [isShowingExtra, setIsShowingExtra] = useState(false);

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

			<details
				open={isShowingExtra}
				onToggle={(e) => setIsShowingExtra(e.newState === "open")}
			>
				<summary>{isShowingExtra ? "Hide" : "Show"} Raw Data</summary>

				<CodeBlock>{currentUser}</CodeBlock>
			</details>
		</section>
	);
};
