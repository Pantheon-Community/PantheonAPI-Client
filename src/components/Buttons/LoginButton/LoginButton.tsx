import { ExternalLink } from "@/components/Links/ExternalLink/ExternalLink";
import { usePantheonApi } from "@/contexts/PantheonApi/PantheonApiContext";
import DiscordSymbolWhite from "./Discord-Symbol-White.svg";
import "./LoginButton.css";

/**
 * Semantically this shouldn't actually be a `<button>` since it navigates the user away from the
 * current page. So despite being called a button and styled like one, it's actually an `<a>`
 * element.
 */
export const LoginButton: React.FC = () => {
    const { loginUrl } = usePantheonApi();

    return (
        <ExternalLink
            className="login-button"
            href={loginUrl}
            target="_self"
            title="Login with Discord"
        >
            <img src={DiscordSymbolWhite} alt="Discord logo" />

            <span>Login</span>
        </ExternalLink>
    );
};
