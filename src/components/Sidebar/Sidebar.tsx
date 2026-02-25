import { InternalLink } from "../Links/InternalLink";
import "./Sidebar.css";

export const Sidebar = () => (
	<div className="navbar">
		<h3>Pantheon API Client</h3>

		<nav>
			<InternalLink href="/">Home</InternalLink>

			<InternalLink href="/settings">Settings</InternalLink>
		</nav>
	</div>
);
