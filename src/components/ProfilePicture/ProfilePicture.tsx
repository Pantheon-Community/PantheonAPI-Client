import type { DiscordId } from "@/shared/types/Common";
import type { SiteImageData } from "@/types/SiteImageData";
import { useMemo } from "react";
import { LazyImage } from "../LazyImage/LazyImage";
import "./ProfilePicture.css";

interface ProfilePictureProps {
    id: DiscordId;

    username: string;

    avatar: string | null;

    size: number;
}

function getDefaultAvatar(id: DiscordId): SiteImageData {
    // How discord calculates default avatar.
    // https://docs.discord.com/developers/reference#:~:text=%2A%2A,-In
    // Haven't actually verified this returns the correct default avatar, but it returns AN avatar
    // so good enough for me ¯\_(ツ)_/¯

    const defaultId = Math.abs(Number(id) >> 22) % 6;

    return {
        src: `https://cdn.discordapp.com/embed/avatars/${defaultId}.png`,
        alt: "Default Discord avatar",
    };
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({ id, username, avatar, size }) => {
    const fallback = useMemo(() => getDefaultAvatar(id), [id]);

    const primary = useMemo<SiteImageData | null>(() => {
        if (avatar === null) {
            return null;
        }

        return {
            src: `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=${size * 2}`,
            alt: `Discord avatar of ${username}`,
        };
    }, [username, avatar, id, size]);

    const style = useMemo(() => ({ "--size": `${size}px` }) as React.CSSProperties, [size]);

    return (
        <LazyImage
            primary={primary}
            fallback={fallback}
            className="profile-picture"
            title={`Discord avatar of ${username}`}
            style={style}
        />
    );
};
