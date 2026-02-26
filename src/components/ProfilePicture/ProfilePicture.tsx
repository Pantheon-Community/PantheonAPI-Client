import { type FC, useMemo, useState } from "react";
import type { DiscordId } from "@/shared/types/Common";
import "./ProfilePicture.css";

interface ProfilePictureProps {
	id: DiscordId;

	username: string;

	avatar: string | null;

	size: number;
}

export const ProfilePicture: FC<ProfilePictureProps> = ({ id, username, avatar, size }) => {
	const [hasErrored, setHasErrored] = useState(false);

	const src = useMemo(() => {
		if (avatar === null || hasErrored) {
			const defaultId = Math.abs(Number(id) >> 22) % 6;

			return `https://cdn.discordapp.com/embed/avatars/${defaultId}.png`;
		}

		return `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=${size * 2}`;
	}, [avatar, hasErrored, id, size]);

	return (
		<img
			className="profile-picture"
			src={src}
			onError={() => setHasErrored(true)}
			alt={`Discord profile of ${username}`}
			width={size}
			height={size}
			title={username}
		/>
	);
};
