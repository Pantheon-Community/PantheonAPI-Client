import { LoginButton } from "@/components/Buttons/LoginButton";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";

export const HomePage = () => {
	const { currentUser } = useCurrentUser();

	return (
		<section className="home-page">
			<h1>Home</h1>

			<p>Welcome to the Pantheon API client.</p>

			<p>There's not much here yet, but will be soon™</p>

			{currentUser === null && <LoginButton />}
		</section>
	);
};
