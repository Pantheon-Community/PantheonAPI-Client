import { CopyTextButton } from "@/components/Buttons/CopyTextButton/CopyTextButton";
import { LoginButton } from "@/components/Buttons/LoginButton/LoginButton";
import { LogoutButton } from "@/components/Buttons/LogoutButton/LogoutButton";
import { StatefulButton } from "@/components/Buttons/StatefulButton/StatefulButton";
import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { Details } from "@/components/Details/Details";
import { DialogBase } from "@/components/Dialogs/DialogBase/DialogBase";
import { ErrorDialog } from "@/components/Dialogs/ErrorDialog/ErrorDialog";
import { RateLimitedDialog } from "@/components/Dialogs/RateLimitedDialog/RateLimitedDialog";
import { LazyImage } from "@/components/LazyImage/LazyImage";
import { LinkGroup, type LinkGroupItem } from "@/components/LinkGroup/LinkGroup";
import { ExternalLink } from "@/components/Links/ExternalLink/ExternalLink";
import { InlineExternalLink } from "@/components/Links/InlineExternalLink/InlineExternalLink";
import { InternalLink } from "@/components/Links/InternalLink/InternalLink";
import { ProfilePicture } from "@/components/ProfilePicture/ProfilePicture";
import { SessionCard } from "@/components/SessionCard/SessionCard";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { SteamUserCard } from "@/components/SteamUserCard/SteamUserCard";
import { BackgroundImage } from "@/images/Background";
import type { DiscordId, Ip, Origin, UserAgent } from "@/shared/types/Common";
import type { SteamId64, SteamUserWithTimes } from "@/shared/types/SteamUser";
import type { UserSessionBasic, UserSessionId } from "@/shared/types/UserSession";
import { useCallback, useMemo, useState } from "react";
import "./ComponentsPage.css";

const linkGroups: LinkGroupItem[] = [
    {
        label: "Option A",
        hash: "",
    },
    {
        label: "Option B",
        hash: "b",
    },
    {
        label: "Option C",
        hash: "c",
    },
];

async function statefulAction(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
}

const json = { foo: "bar", hello: 123, eio: true };

const steamUserA: SteamUserWithTimes = {
    id: "76561198200316171" as SteamId64,
    username: "NachoToast",
    avatar: "https://avatars.fastly.steamstatic.com/d789a47289ccb8c36eea2055a9b700e7718c6fac_full.jpg",
    location: "New Zealand",
    memberSince: new Date().toISOString(),
    analytics: {
        firstSeenAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        timesSeen: 0,
    },
};

const steamUserB: SteamUserWithTimes = {
    id: "76561198200316171" as SteamId64,
    username: "NachoToast",
    avatar: null,
    location: "Australia",
    memberSince: new Date(0).toISOString(),
    analytics: {
        firstSeenAt: new Date(0).toISOString(),
        lastSeenAt: new Date().toISOString(),
        timesSeen: 0,
    },
};

const session: UserSessionBasic = {
    id: 123 as UserSessionId,
    startedAt: new Date().toISOString(),
    ip: "123.123.123.123" as Ip,
    userAgent: navigator.userAgent as UserAgent,
    origin: window.origin as Origin,
    lastActionAt: new Date().toISOString(),
};

export const ComponentsPage: React.FC = () => {
    const [dialogEl, setDialogEl] = useState<React.ReactNode>();

    const closeDialog = useCallback(() => setDialogEl(undefined), []);

    const openDialogBase = useCallback(() => {
        setDialogEl(
            <DialogBase title="Dialog Base" onClose={closeDialog}>
                <p>Dialog base description.</p>
            </DialogBase>,
        );
    }, [closeDialog]);

    const errorData = useMemo(() => {
        return {
            error: {
                title: "Example Error",
                description: "Example error description.",
            },
            status: { code: 200, text: "Too Sigma" },
            close: closeDialog,
            suggestLogout: true,
        } as const;
    }, [closeDialog]);

    const openErrorDialog = useCallback(() => {
        setDialogEl(<ErrorDialog errorData={errorData} />);
    }, [errorData]);

    const openRateLimitedDialog = useCallback(() => {
        setDialogEl(<RateLimitedDialog endsAt={Date.now() + 1000 * 10} onClose={closeDialog} />);
    }, [closeDialog]);

    return (
        <section className="components-page">
            {dialogEl}

            <h1>Components</h1>

            <h3>Text</h3>

            <div>
                <h1>H1</h1>

                <h2>H2</h2>

                <h3>H3</h3>

                <h4>H4</h4>

                <h5>H5</h5>

                <p>Paragraph</p>

                <a href="#anchor">Anchor</a>

                <pre>Pre</pre>

                <ExternalLink href="/">External Link</ExternalLink>

                <InternalLink href="/">Internal Link</InternalLink>

                <InlineExternalLink href="/" title="Inline External Link">
                    Inline External Link
                </InlineExternalLink>
            </div>

            <h3>Buttons</h3>

            <div>
                <button>Button</button>

                <CopyTextButton text="copy text button" />

                <LoginButton />

                <LogoutButton />

                <StatefulButton
                    onClick={statefulAction}
                    textDo="Stateful"
                    textDoing="Doing"
                    textDone="Done!"
                />
            </div>

            <h3>Dialogs</h3>

            <div>
                <button onClick={openDialogBase}>Dialog Base</button>

                <button onClick={openErrorDialog}>Error Dialog</button>

                <button onClick={openRateLimitedDialog}>Rate Limited Dialog</button>
            </div>

            <h3>Images</h3>

            <div>
                <LazyImage primary={null} title="Perpetually loading" className="bg" />

                <LazyImage primary={BackgroundImage} title="Resolved primary" className="bg" />

                <LazyImage
                    primary={null}
                    fallback={BackgroundImage}
                    title="Only fallback"
                    className="bg"
                />

                <ProfilePicture
                    id={"909645967081476147" as DiscordId}
                    username="Test"
                    avatar={null}
                    size={32}
                />

                <ProfilePicture
                    id={"1464590458138267671" as DiscordId}
                    username="Test"
                    avatar={null}
                    size={64}
                />

                <ProfilePicture
                    id={"1474287155340644530" as DiscordId}
                    username="Test"
                    avatar={null}
                    size={128}
                />
            </div>

            <h3>Details</h3>

            <div>
                <details open>
                    <summary>Details</summary>

                    <p>Content</p>
                </details>

                <Details open summaryWhenClosed="Details Closed" summaryWhenOpen="Details Opened">
                    <p>Content</p>
                </Details>

                <details className="margined" open>
                    <summary>Margined</summary>

                    <p>Content</p>
                </details>

                <details className="indented" open>
                    <summary>Indented</summary>

                    <p>Content</p>
                </details>

                <details className="margined indented" open>
                    <summary>Both</summary>

                    <p>Content</p>
                </details>
            </div>

            <h3>Other</h3>

            <div>
                <CodeBlock>{json}</CodeBlock>

                <LinkGroup options={linkGroups} />

                <Sidebar />

                <SteamUserCard user={steamUserA} />

                <SteamUserCard user={steamUserA} isPrimary />

                <SteamUserCard user={steamUserB} />

                <SessionCard session={session} />
            </div>
        </section>
    );
};
