import { CopyTextButton } from "@/components/Buttons/CopyTextButton/CopyTextButton";
import { LogoutButton } from "@/components/Buttons/LogoutButton/LogoutButton";
import { StatefulButton } from "@/components/Buttons/StatefulButton/StatefulButton";
import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { Details } from "@/components/Details/Details";
import { ProfilePicture } from "@/components/ProfilePicture/ProfilePicture";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { usePantheonApi } from "@/contexts/PantheonApi/PantheonApiContext";
import type { AuthResponse } from "@/shared/types/Responses/AuthResponse";
import type { GetMeResponse } from "@/shared/types/Responses/GetMeResponse";
import { useCallback } from "react";
import "./ProfileDetails.css";

export const ProfileDetails: React.FC<{ currentUser: AuthResponse }> = ({ currentUser }) => {
    const { makeJsonRequest } = usePantheonApi();

    const { setCurrentUser } = useCurrentUser();

    const refreshUser = useCallback(async () => {
        const response = await makeJsonRequest<GetMeResponse>("/users/@me", {
            headers: {
                authorization: `Bearer ${currentUser.token}`,
                accept: "application/json",
            },
        });

        if (response !== null) {
            setCurrentUser((prev) => {
                if (prev === null) return null;
                return { ...prev, ...response };
            });
        }
    }, [makeJsonRequest, currentUser.token, setCurrentUser]);

    return (
        <div className="profile-details">
            <div className="summary">
                <ProfilePicture
                    id={currentUser.user.id}
                    username={currentUser.user.username}
                    avatar={currentUser.user.avatar}
                    size={128}
                />

                <p>What a beautiful profile.</p>

                <p className="discord-id">
                    <span>Discord ID {currentUser.user.id}</span>
                    <CopyTextButton text={currentUser.user.id} />
                </p>

                <div className="profile-buttons">
                    <LogoutButton />

                    <StatefulButton
                        className="refresh-button"
                        type="button"
                        onClick={refreshUser}
                        textDo="Refresh"
                        textDoing="Refreshing..."
                        textDone="Refreshed!"
                    />
                </div>
            </div>

            <Details summaryWhenClosed="Show Raw Data" summaryWhenOpen="Hide Raw Data">
                <CodeBlock>{currentUser}</CodeBlock>
            </Details>
        </div>
    );
};
