import type { UserSessionBasic } from "@/shared/types/UserSession";
import type { SiteImageData } from "@/types/SiteImageData";
import { durationShort } from "@/utils/relativeTime";
import { getBrowser, getIsMobile, getOperatingSystem } from "@/utils/userAgentAnalysers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LazyImage } from "../LazyImage/LazyImage";
import { InlineExternalLink } from "../Links/InlineExternalLink/InlineExternalLink";
import ChromeLogo from "./Logos/Chrome.svg";
import EdgeLogo from "./Logos/Edge.svg";
import FirefoxLogo from "./Logos/Firefox.svg";
import OperaLogo from "./Logos/Opera.svg";
import SafariLogo from "./Logos/Safari.svg";
import UnknownLogo from "./Logos/Unknown.png";
import "./SessionCard.css";

interface SessionCardProps {
    session: UserSessionBasic;

    onDelete?(): Promise<void>;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onDelete }) => {
    const { startedAt, fingerprint, lastActionAt } = session;
    const { ip, userAgent, origin } = fingerprint;

    const getLastActiveTime = useCallback(() => {
        return durationShort(Date.now(), new Date(lastActionAt).getTime());
    }, [lastActionAt]);

    const logo = useMemo<SiteImageData>(() => {
        if (userAgent === null) {
            return { src: UnknownLogo, alt: "eyes staring into your soul" };
        }

        switch (getBrowser(userAgent)) {
            case "Chrome":
                return { src: ChromeLogo, alt: "Google Chrome logo" };
            case "Edge":
                return { src: EdgeLogo, alt: "Microsoft Edge logo" };
            case "Firefox":
                return { src: FirefoxLogo, alt: "Mozilla Firefox logo" };
            case "Opera":
                return { src: OperaLogo, alt: "Opera browser logo" };
            case "Safari":
                return { src: SafariLogo, alt: "Apple Safari logo" };
            case null:
            default:
                return { src: UnknownLogo, alt: "eyes staring into your soul" };
        }
    }, [userAgent]);

    const [lastActiveTime, setLastActiveTime] = useState(getLastActiveTime);

    useEffect(() => {
        const interval = setInterval(() => setLastActiveTime(getLastActiveTime()), 1000);

        return () => clearInterval(interval);
    }, [getLastActiveTime]);

    const browser = useMemo(() => {
        if (userAgent) {
            const mobile = getIsMobile(userAgent) ? "Mobile/Tablet" : "Desktop";

            const output = getBrowser(userAgent);

            if (output !== null) {
                return `${output} (${mobile})`;
            }

            return `Unknown Browser (${mobile})`;
        }

        return `Unknown Browser`;
    }, [userAgent]);

    const originUrl = useMemo(() => {
        if (origin === null) return null;

        let url: string = origin;

        if (!url.startsWith("http")) {
            url = `https://${url}`;
        }

        if (!URL.canParse(url)) return null;

        return new URL(url);
    }, [origin]);

    const os = useMemo(() => {
        if (userAgent !== null) {
            const output = getOperatingSystem(userAgent);

            if (output !== null) {
                return output;
            }
        }

        return "Unknown Operating System";
    }, [userAgent]);

    return (
        <div className="session-card">
            <div className="main-content">
                <LazyImage primary={logo} />

                <h4>
                    <span>
                        {ip} - {browser}
                    </span>

                    {!!onDelete && (
                        <button type="button" onClick={onDelete}>
                            Delete
                        </button>
                    )}
                </h4>

                <p>Last active {lastActiveTime} ago.</p>

                {!!originUrl && (
                    <p>
                        <InlineExternalLink
                            href={originUrl.toString()}
                            title={originUrl.toString()}
                        >
                            {originUrl.hostname}
                        </InlineExternalLink>
                    </p>
                )}
            </div>

            <div className="footer">
                <p title={new Date(startedAt).toLocaleString("en-NZ")}>
                    Created {new Date(startedAt).toLocaleDateString("en-NZ")}
                </p>

                <p>{os}</p>
            </div>
        </div>
    );
};
