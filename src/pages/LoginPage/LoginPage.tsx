import { LoginButton } from "@/components/Buttons/LoginButton/LoginButton";
import { LogoutButton } from "@/components/Buttons/LogoutButton/LogoutButton";
import { InternalLink } from "@/components/Links/InternalLink/InternalLink";
import { BROWSER_STATE } from "@/constants/browserState";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import "./LoginPage.css";
import { LoginInvalidState } from "./SubPages/LoginInvalidState";

enum LoginState {
    Init,

    Fetching,

    NoCode,

    InvalidState,

    Redirecting,

    AlreadyLoggedIn,
}

export const LoginPage: React.FC = () => {
    const { currentUser, login } = useCurrentUser();

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [loginState, setLoginState] = useState(LoginState.Init);

    useEffect(() => {
        if (loginState !== LoginState.Init) return;

        if (currentUser !== null) {
            setLoginState(LoginState.AlreadyLoggedIn);
            return;
        }

        // avoid double request in strict mode
        const code = searchParams.get("code");

        if (code === null) {
            setLoginState(LoginState.NoCode);
            return;
        }

        const receivedState = searchParams.get("state");

        if (receivedState === null || receivedState !== BROWSER_STATE) {
            setLoginState(LoginState.InvalidState);
            return;
        }

        const controller = new AbortController();

        setLoginState(LoginState.Fetching);

        void login(code).then(async () => {
            setLoginState(LoginState.Redirecting);
            await navigate("/");
        });

        return () => controller.abort();
    }, [currentUser, login, loginState, navigate, searchParams]);

    if (loginState === LoginState.InvalidState) {
        return <LoginInvalidState />;
    }

    return (
        <section className="login-page">
            <h1>Log In</h1>

            {currentUser !== null && (
                <>
                    <p>
                        You're already logged in as <b>{currentUser.user.username}</b>, silly!
                    </p>

                    <InternalLink href="/profile">
                        <button type="button" className="go-to-profile-button">
                            View Profile
                        </button>
                    </InternalLink>

                    <LogoutButton />
                </>
            )}

            {loginState === LoginState.NoCode && (
                <>
                    <p>What are you waiting for?</p>

                    <LoginButton />
                </>
            )}

            {(loginState === LoginState.Init ||
                loginState === LoginState.Fetching ||
                loginState === LoginState.Redirecting) && <p>Logging you in...</p>}

            {currentUser === null && loginState === LoginState.AlreadyLoggedIn && (
                <>
                    <p>Well, you got what you wanted.</p>

                    <LoginButton />
                </>
            )}
        </section>
    );
};
