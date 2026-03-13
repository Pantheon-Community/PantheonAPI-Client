import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const LoginRedirecting: React.FC = () => {
    const navigate = useNavigate();

    const { currentUser } = useCurrentUser();

    const [secondsTillLeave, setSecondsTillLeave] = useState(3);

    useEffect(() => {
        if (currentUser?.user.id === null) return;

        const interval = setInterval(() => setSecondsTillLeave((prev) => prev - 1), 1000);

        return () => clearInterval(interval);
    }, [currentUser?.user.id]);

    useEffect(() => {
        if (secondsTillLeave <= 0) {
            void navigate("/");
        }
    }, [secondsTillLeave, navigate]);

    return (
        <section>
            <h1>Logged In</h1>

            {currentUser !== null ? (
                <>
                    <p>
                        Successfully logged in as <b>{currentUser.user.username}</b>.
                    </p>

                    <p>
                        Redirecting you to the homepage in{" "}
                        <b>
                            {secondsTillLeave} second{secondsTillLeave !== 1 ? "s" : ""}
                        </b>
                        .
                    </p>
                </>
            ) : (
                <p>Initialising session...</p>
            )}
        </section>
    );
};
