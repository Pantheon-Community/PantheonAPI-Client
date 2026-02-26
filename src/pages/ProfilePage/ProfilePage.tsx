import hljs from "highlight.js/lib/common";
import { type ToggleEvent, useCallback, useContext, useState } from "react";
import { LoginButton } from "@/components/Buttons/LoginButton";
import { SessionContext } from "@/contexts/Session";

export const ProfilePage = () => {
	const { session } = useContext(SessionContext);

	const [isShowingExtra, setIsShowingExtra] = useState(false);

	const handleToggle = useCallback((e: ToggleEvent<HTMLDetailsElement>) => {
		if (e.newState === "open") {
			setIsShowingExtra(true);
			hljs.highlightAll();
		} else {
			setIsShowingExtra(false);
		}
	}, []);

	if (session === null)
		return (
			<section>
				<h1>Not Logged In</h1>

				<p>You need to be logged in to view your profile.</p>

				<LoginButton />
			</section>
		);

	return (
		<section>
			<h1>{session?.user.username}</h1>

			<p>What a beautiful profile.</p>

			<details open={isShowingExtra} onToggle={handleToggle}>
				<summary>{isShowingExtra ? "Hide" : "Show"} Raw Data</summary>

				<pre>
					<code className="language-json">{JSON.stringify(session, undefined, 4)}</code>
				</pre>
			</details>
		</section>
	);
};
