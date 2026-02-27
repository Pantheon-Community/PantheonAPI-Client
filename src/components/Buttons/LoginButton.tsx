import { useContext } from "react";
import { SettingsContext } from "@/contexts/Settings";
import { ExternalLink } from "../Links/ExternalLink";
import "./LoginButton.css";
import { SessionContext } from "@/contexts/Session";
import DiscordSymbolWhite from "../../images/Discord-Symbol-White.svg";

export const LoginButton = () => {
	const { sessionData } = useContext(SettingsContext);
	const { session } = useContext(SessionContext);

	return (
		<ExternalLink
			className="login-button"
			href={sessionData.oAuthLink}
			title="Login with Discord"
			target="_self"
		>
			<button type="button" disabled={session !== null}>
				<img src={DiscordSymbolWhite} alt="Discord logo" />

				<span>Login</span>
			</button>
		</ExternalLink>
	);
};
