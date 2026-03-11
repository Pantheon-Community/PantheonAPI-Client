import type { SteamUserBasicWithTimes } from "@/shared/types/SteamUser";
import { useMemo } from "react";
import { StatefulButton } from "../Buttons/StatefulButton";
import { LazyImage } from "../LazyImage/LazyImage";
import Steam from "./Steam.svg";
import "./SteamUserCard.css";

interface SteamUserCardProps {
    user: SteamUserBasicWithTimes;

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
        <div className={`steam-user-card ${isPrimary ? "primary" : ""}`}>
            <LazyImage
                primarySrc={avatar}
                fallbackSrc={Steam}
                className="steam-avatar"
                alt={`Steam profile of ${username}`}
                title={username}
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
