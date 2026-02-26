import { useContext } from "react";
import { InternalLink } from "../Links/InternalLink";
import "./Sidebar.css";
import { SessionContext } from "@/contexts/Session";
import { ProfilePicture } from "../ProfilePicture/ProfilePicture";

export const Sidebar = () => {
	const { session } = useContext(SessionContext);

	return (
		<div className="sidebar">
			<h3>Pantheon API Client</h3>

			<nav>
				<InternalLink href="/">Home</InternalLink>

				{session !== null && (
					<InternalLink href="/profile">
						<span className="inline-profile">
							<span>Profile</span>

							<ProfilePicture
								id={session.user.id}
								username={session.user.username}
								avatar={session.user.avatar}
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
