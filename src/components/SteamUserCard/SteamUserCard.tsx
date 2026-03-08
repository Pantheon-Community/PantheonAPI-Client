import { useSteamUserInfo } from "@/contexts/SteamUserCache/SteamUserCacheContext";
import type { SteamUserBasicWithTimes } from "@/shared/types/SteamUser";
import { useMemo } from "react";
import { LazyImage } from "../LazyImage/LazyImage";
import "./SteamUserCard.css";

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

export const SteamUserCard: React.FC<{ user: SteamUserBasicWithTimes }> = ({ user }) => {
    const { id, username } = user;

    const info = useSteamUserInfo(id);

    const locationString = useMemo(() => {
        if (!info?.location) return null;

        const emoji = getCountryEmoji(info.location);

        if (emoji !== null) {
            return `${emoji} ${info.location}`;
        }

        return info.location;
    }, [info?.location]);

    const memberSinceString = useMemo(() => {
        if (!info?.memberSince) return null;

        return `Created ${dateLocale.format(new Date(info.memberSince))}`;
    }, [info?.memberSince]);

    return (
        <div className="steam-user-card">
            <LazyImage
                primarySrc={info?.avatarFull}
                className="steam-avatar"
                alt={`Steam profile of ${username}`}
            />

            <p>{username}</p>

            {!!locationString && <p className="steam-location">{locationString}</p>}

            {!!memberSinceString && <p className="steam-member-since">{memberSinceString}</p>}

            <p className="steam-id">{id}</p>
        </div>
    );
};
