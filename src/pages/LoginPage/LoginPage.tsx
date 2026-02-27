import { type FC, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LoginButton } from "@/components/Buttons/LoginButton";
import { SessionContext } from "@/contexts/Session";
import { SettingsContext } from "@/contexts/Settings";
import "./LoginPage.css";
import { LogoutButton } from "@/components/Buttons/LogoutButton";
import { InternalLink } from "@/components/Links/InternalLink";

enum LoginState {
	Init,

	NoCode,

	CrossSiteRequestForgery,

	Redirecting,

	AlreadyLoggedIn,
}

export const LoginPage: FC = () => {
	const { sessionData } = useContext(SettingsContext);
	const { session, requestLogin } = useContext(SessionContext);

	const [searchParams] = useSearchParams();

	const navigate = useNavigate();

	const [loginState, setLoginState] = useState(LoginState.Init);

	const isRequesting = useRef(false);

	useEffect(() => {
		if (loginState !== LoginState.Init) return;

		if (session !== null) {
			setLoginState(LoginState.AlreadyLoggedIn);
			return;
		}

		// avoid double request in strict mode
		if (isRequesting.current) return;
		isRequesting.current = true;

		const code = searchParams.get("code");

		if (code === null) {
			setLoginState(LoginState.NoCode);
			return;
		}

		const state = searchParams.get("state");

		if (state === null || state !== sessionData.state) {
			setLoginState(LoginState.CrossSiteRequestForgery);
			return;
		}

		const controller = new AbortController();

		requestLogin(code).then(async () => {
			setLoginState(LoginState.Redirecting);

			await navigate("/");
		});

		return () => {
			controller.abort();
		};
	}, [searchParams, loginState, navigate, requestLogin, sessionData.state, session]);

	return (
		<section className="login-page">
			<h1>Log In</h1>

			{session !== null && (
				<>
					<p>
						You're already logged in as <b>{session.user.username}</b>, silly!
					</p>

					<InternalLink href="/profile">Go to your profile</InternalLink>

					<LogoutButton />
				</>
			)}

			{loginState === LoginState.NoCode && (
				<>
					<p>What are you waiting for?</p>

					<LoginButton />
				</>
			)}

			{loginState === LoginState.CrossSiteRequestForgery && (
				<>
					<p className="uh-oh">CSRF Detected</p>

					<p>
						Your login request may have been intercepted, are you on a secure network?
					</p>
				</>
			)}

			{(loginState === LoginState.Init || loginState === LoginState.Redirecting) && (
				<p>Logging you in...</p>
			)}

			{session === null && loginState === LoginState.AlreadyLoggedIn && (
				<>
					<p>Well, you got what you wanted.</p>

					<LoginButton />
				</>
			)}
		</section>
	);
};
