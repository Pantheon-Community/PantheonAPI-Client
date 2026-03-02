import { InternalLink } from "../Links/InternalLink";
import "./Sidebar.css";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { ProfilePicture } from "../ProfilePicture/ProfilePicture";

export const Sidebar = () => {
	const { currentUser } = useCurrentUser();

	return (
		<div className="sidebar">
			<h4>Pantheon API Client</h4>

			<nav>
				<InternalLink href="/">Home</InternalLink>

				{currentUser !== null && (
					<InternalLink href="/profile">
						<span className="inline-profile">
							<span>Profile</span>

							<ProfilePicture
								id={currentUser.user.id}
								username={currentUser.user.username}
								avatar={currentUser.user.avatar}
								size={32}
							/>
						</span>
					</InternalLink>
				)}

				<InternalLink href="/settings">Settings</InternalLink>
			</nav>
		</div>
	);
};
