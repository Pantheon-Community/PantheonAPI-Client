import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const LoginRedirecting: React.FC = () => {
    const navigate = useNavigate();

    const { currentUser } = useCurrentUser();

    useEffect(() => {
        if (currentUser === null) return;

        void navigate("/");
    }, [currentUser, navigate]);

    return (
        <section>
            <h1>Logged In</h1>

            {currentUser !== null ? (
                <>
                    <p>
                        Successfully logged in as <b>{currentUser.user.username}</b>.
                    </p>

                    <p>Redirecting you to the homepage...</p>
                </>
            ) : (
                <p>Initialising session...</p>
            )}
        </section>
    );
};
