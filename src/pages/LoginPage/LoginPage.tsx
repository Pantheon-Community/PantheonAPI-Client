import { BROWSER_STATE } from "@/constants/browserState";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { LoginAlreadyLoggedIn } from "./SubPages/LoginAlreadyLoggedIn";
import { LoginInvalidState } from "./SubPages/LoginInvalidState";
import { LoginNoCode } from "./SubPages/LoginNoCode";
import { LoginRedirecting } from "./SubPages/LoginRedirecting";

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
        });

        return () => controller.abort();
    }, [currentUser, login, loginState, searchParams]);

    switch (loginState) {
        case LoginState.InvalidState:
            return <LoginInvalidState />;
        case LoginState.AlreadyLoggedIn:
            return <LoginAlreadyLoggedIn />;
        case LoginState.NoCode:
            return <LoginNoCode />;
        case LoginState.Init:
            return (
                <section>
                    <h1>Logging In</h1>

                    <p>Initialising...</p>
                </section>
            );
        case LoginState.Fetching:
            return (
                <section>
                    <h1>Logging In</h1>

                    <p>Creating session...</p>
                </section>
            );
        case LoginState.Redirecting:
            return <LoginRedirecting />;
    }
};
