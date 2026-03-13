import { LoginButton } from "@/components/Buttons/LoginButton/LoginButton";
import { LinkGroup, type LinkGroupItem } from "@/components/LinkGroup/LinkGroup";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { useLocationHash } from "@/hooks/useLocationHash";
import { ProfileConnections } from "./SubPages/ProfileConnections";
import { ProfileDetails } from "./SubPages/ProfileDetails";
import { ProfileSessions } from "./SubPages/ProfileSessions";

const subPages: LinkGroupItem[] = [
    {
        label: "Details",
        hash: "",
    },
    {
        label: "Steam Connections",
        hash: "connections",
    },
    {
        label: "Sessions",
        hash: "sessions",
    },
];

export const ProfilePage: React.FC = () => {
    const { currentUser } = useCurrentUser();

    const hash = useLocationHash();

    if (currentUser === null)
        return (
            <section>
                <h1>Not Logged In</h1>

                <p>You need to be logged in to view your profile.</p>

                <LoginButton />
            </section>
        );

    return (
        <section>
            <h1>{currentUser.user.username}</h1>

            <LinkGroup options={subPages} />

            {hash === "sessions" ? (
                <ProfileSessions currentUser={currentUser} />
            ) : hash === "connections" ? (
                <ProfileConnections currentUser={currentUser} />
            ) : (
                <ProfileDetails currentUser={currentUser} />
            )}
        </section>
    );
};
