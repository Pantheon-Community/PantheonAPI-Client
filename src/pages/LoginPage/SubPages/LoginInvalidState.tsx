import { LoginButton } from "@/components/Buttons/LoginButton/LoginButton";
import { InlineExternalLink } from "@/components/Links/InlineExternalLink/InlineExternalLink";

export const LoginInvalidState: React.FC = () => {
    return (
        <section>
            <h1>Invalid State</h1>
            <p>The state of your login request did not match the state stored by this website.</p>

            <p>
                This can happen if you logged in from a different tab or pasted a link directly.
                <br />
                If this is the case for you, try again using the login button below.
            </p>

            <LoginButton />

            <details className="indented margined">
                <summary>But I did log in from this tab!</summary>

                <p>
                    If you're certain that you logged in from this site ({window.location.hostname}
                    ), then you are likely the victim of{" "}
                    <b className="bad">Cross Site Request Forgery (CSRF)</b>.
                    <br />
                    <br />
                    Your network may be compromised, or you may have just clicked on a sussy link.
                    <br />
                    <br />
                    Either way, <span className="bad">don't try logging in again</span>.
                    <br />
                    <br />
                    Consider reaching out to a Pantheon developer for assistance.
                </p>
            </details>

            <details className="indented margined">
                <summary>Why can't you just log me in anyways?</summary>

                <p>
                    Security reasons bruh. Don't take my word for it,{" "}
                    <InlineExternalLink
                        href="https://docs.discord.com/developers/topics/oauth2#state-and-security"
                        title="Discord Docs"
                    >
                        take Discord's.
                    </InlineExternalLink>
                </p>
            </details>
        </section>
    );
};
