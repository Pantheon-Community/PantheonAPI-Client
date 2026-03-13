import { CopyTextButton } from "@/components/Buttons/CopyTextButton/CopyTextButton";
import { LoginButton } from "@/components/Buttons/LoginButton/LoginButton";
import { ExternalLink } from "@/components/Links/ExternalLink/ExternalLink";
import { InlineExternalLink } from "@/components/Links/InlineExternalLink/InlineExternalLink";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import "./HomePage.css";

const NavItem: React.FC<{ href: string; children: string }> = ({ href, children }) => (
    <div>
        <ExternalLink href={href} title={children}>
            {children}
        </ExternalLink>

        <CopyTextButton text={href} />
    </div>
);

export const HomePage: React.FC = () => {
    const { currentUser } = useCurrentUser();

    return (
        <section className="home-page">
            <h1>Home</h1>

            <p>Welcome to the Pantheon API development client.</p>

            <p>
                If you weren't directed here by a developer, and aren't sure what this is, you
                might've instead meant to{" "}
                <InlineExternalLink
                    title="Pantheon Community Main Website"
                    href="https://pantheoncommunity.org"
                >
                    go to our main website.
                </InlineExternalLink>
            </p>

            <h3>Quick Links</h3>

            <nav>
                <NavItem href="https://pantheoncommunity.org">Main Website</NavItem>

                <NavItem href="https://api.pantheoncommunity.org">Pantheon API</NavItem>

                <NavItem href="https://github.com/Pantheon-Community/PantheonAPI">
                    Pantheon API (Github)
                </NavItem>

                <NavItem href="https://github.com/Pantheon-Community/PantheonAPI-Client">
                    Pantheon API Client (Github)
                </NavItem>

                <NavItem href="https://github.com/Pantheon-Community/PantheonAPI-Types">
                    Pantheon API Types (Github)
                </NavItem>

                <NavItem href="https://discord.gg/zBkdRSCEpG">Pantheon Discord</NavItem>
            </nav>

            {currentUser === null && <LoginButton />}
        </section>
    );
};
