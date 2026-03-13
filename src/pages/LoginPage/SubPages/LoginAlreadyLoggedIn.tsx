import { LoginButton } from "@/components/Buttons/LoginButton/LoginButton";
import { LogoutButton } from "@/components/Buttons/LogoutButton/LogoutButton";
import { InternalLink } from "@/components/Links/InternalLink/InternalLink";
import { ProfilePicture } from "@/components/ProfilePicture/ProfilePicture";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import "./LoginAlreadyLoggedIn.css";

export const LoginAlreadyLoggedIn: React.FC = () => {
    const { currentUser } = useCurrentUser();

    return (
        <section className="login-page">
            <h1>{currentUser === null ? "o/" : "Already Logged In"}</h1>

            {currentUser !== null ? (
                <>
                    <p>
                        You're already logged in as <b>{currentUser.user.username}</b>, silly!
                    </p>

                    <InternalLink href="/profile">
                        <button type="button" className="go-to-profile-button">
                            <ProfilePicture
                                id={currentUser.user.id}
                                username={currentUser.user.username}
                                avatar={currentUser.user.avatar}
                                size={32}
                            />
                            View Profile
                        </button>
                    </InternalLink>

                    <LogoutButton />
                </>
            ) : (
                <>
                    <p>Well, you got what you wanted.</p>

                    <LoginButton />
                </>
            )}
        </section>
    );
};
