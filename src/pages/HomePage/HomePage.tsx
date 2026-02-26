import { useContext } from "react";
import { LoginButton } from "@/components/Buttons/LoginButton";
import { SessionContext } from "@/contexts/Session";

export const HomePage = () => {
	const { session } = useContext(SessionContext);

	return (
		<section className="home-page">
			<h1>Home</h1>

			<p>Welcome to the Pantheon API client.</p>

			<p>There's not much here yet, but will be soon™</p>

			{session === null && <LoginButton />}
		</section>
	);
};
