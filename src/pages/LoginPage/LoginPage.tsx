import { type FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LoginButton } from "@/components/Buttons/LoginButton";
import "./LoginPage.css";
import { LogoutButton } from "@/components/Buttons/LogoutButton";
import { InternalLink } from "@/components/Links/InternalLink";
import { useBrowserSession } from "@/contexts/BrowserSession/BrowserSessionContext";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";

enum LoginState {
	Init,

	Fetching,

	NoCode,

	CrossSiteRequestForgery,

	Redirecting,

	AlreadyLoggedIn,
}

export const LoginPage: FC = () => {
	const { state } = useBrowserSession();
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

		if (receivedState === null || receivedState !== state) {
			setLoginState(LoginState.CrossSiteRequestForgery);
			return;
		}

		const controller = new AbortController();

		setLoginState(LoginState.Fetching);

		login(code).then(async () => {
			setLoginState(LoginState.Redirecting);
			await navigate("/");
		});

		return () => controller.abort();
	}, [currentUser, login, loginState, navigate, searchParams, state]);

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

			{loginState === LoginState.CrossSiteRequestForgery && (
				<>
					<p className="uh-oh">CSRF Detected</p>

					<p>
						Your login request may have been intercepted, are you on a secure network?
					</p>
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
