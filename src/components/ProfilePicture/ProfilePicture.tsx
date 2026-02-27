import { type FC, useMemo } from "react";
import type { DiscordId } from "@/shared/types/Common";
import "./ProfilePicture.css";
import { LazyImage } from "../LazyImage/LazyImage";

interface ProfilePictureProps {
	id: DiscordId;

	username: string;

	avatar: string | null;

	size: number;
}

function getDefaultAvatar(id: DiscordId): string {
	// How discord calculates default avatar.
	// https://docs.discord.com/developers/reference#:~:text=%2A%2A,-In
	// Haven't actually verified this returns the correct default avatar, but it returns AN avatar
	// so good enough for me ¯\_(ツ)_/¯

	const defaultId = Math.abs(Number(id) >> 22) % 6;

	return `https://cdn.discordapp.com/embed/avatars/${defaultId}.png`;
}

export const ProfilePicture: FC<ProfilePictureProps> = ({ id, username, avatar, size }) => {
	const fallbackSrc = useMemo(() => getDefaultAvatar(id), [id]);

	const primarySrc = useMemo(() => {
		if (avatar === null) {
			return fallbackSrc;
		}

		return `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=${size * 2}`;
	}, [avatar, id, size, fallbackSrc]);

	return (
		<LazyImage
			className="profile-picture"
			primarySrc={primarySrc}
			fallbackSrc={fallbackSrc}
			alt={`Discord profile of ${username}`}
			width={size}
			height={size}
			title={username}
		/>
	);
};
