import { SteamImage } from "@/images/Steam";
import type { SteamUserWithTimes } from "@/shared/types/SteamUser";
import type { SiteImageData } from "@/types/SiteImageData";
import { useMemo } from "react";
import { StatefulButton } from "../Buttons/StatefulButton/StatefulButton";
import { LazyImage } from "../LazyImage/LazyImage";
import "./SteamUserCard.css";

interface SteamUserCardProps {
    user: SteamUserWithTimes;

    isPrimary?: boolean;

    onClickButton?(): Promise<void>;
}

const dateLocale = new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

function getCountryEmoji(country: string): string | null {
    switch (country) {
        case "New Zealand":
            return "🇳🇿";
        case "Australia":
            return "🇦🇺";
        default:
            return null;
    }
}

export const SteamUserCard: React.FC<SteamUserCardProps> = (props) => {
    const { user, isPrimary = false, onClickButton } = props;
    const { id, username, avatar, location, memberSince } = user;

    const primary = useMemo<SiteImageData | null>(() => {
        if (avatar === null) {
            return null;
        }

        return { src: avatar, alt: `Steam avatar of ${username}` };
    }, [avatar, username]);

    const locationString = useMemo(() => {
        if (!location) return null;

        const emoji = getCountryEmoji(location);

        if (emoji !== null) {
            return `${emoji} ${location}`;
        }

        return location;
    }, [location]);

    const memberSinceString = useMemo(() => {
        if (!memberSince) return null;

        return `Created ${dateLocale.format(new Date(memberSince))}`;
    }, [memberSince]);

    return (
        <div className={`steam-user-card${isPrimary ? " primary" : ""}`}>
            <LazyImage
                primary={primary}
                fallback={SteamImage}
                title={`Steam profile of ${username}`}
                className="steam-avatar"
            />

            <p>{username}</p>

            {!!locationString && <p className="steam-location">{locationString}</p>}

            {!!memberSinceString && <p className="steam-member-since">{memberSinceString}</p>}

            <p className="steam-id">{id}</p>

            {!!onClickButton && !isPrimary && (
                <StatefulButton
                    onClick={onClickButton}
                    textDo="Set as Primary"
                    textDoing="Setting as Primary..."
                    textDone="Set as Primary!"
                />
            )}
        </div>
    );
};
