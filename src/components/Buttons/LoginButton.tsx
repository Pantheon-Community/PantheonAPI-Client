import { useContext } from "react";
import { SettingsContext } from "@/contexts/Settings";
import { ExternalLink } from "../Links/ExternalLink";
import "./LoginButton.css";
import DiscordSymbolWhite from "../../images/Discord-Symbol-White.svg";

export const LoginButton = () => {
	const { sessionData } = useContext(SettingsContext);

	return (
		<ExternalLink href={sessionData.oAuthLink} title="Login with Discord" target="_self">
			<button className="login-button" type="button">
				<img src={DiscordSymbolWhite} alt="Discord logo" />

				<span>Login</span>
			</button>
		</ExternalLink>
	);
};
