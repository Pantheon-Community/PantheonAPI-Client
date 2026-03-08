import { useBrowserSession } from "@/contexts/BrowserSession/BrowserSessionContext";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import DiscordSymbolWhite from "../../images/Discord-Symbol-White.svg";
import { ExternalLink } from "../Links/ExternalLink";
import "./LoginButton.css";

export const LoginButton: React.FC = () => {
    const { oAuthLink } = useBrowserSession();
    const { currentUser } = useCurrentUser();

    return (
        <ExternalLink
            className="login-button"
            href={oAuthLink}
            title="Login with Discord"
            target="_self"
        >
            <button type="button" disabled={currentUser !== null}>
                <img src={DiscordSymbolWhite} alt="Discord logo" />

                <span>Login</span>
            </button>
        </ExternalLink>
    );
};
