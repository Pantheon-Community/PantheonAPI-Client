/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import Background from "./images/Background.png";

const elem = document.body;

elem.style.backgroundImage = `linear-gradient(-45deg, rgba(0,0,0,0.8)), url(${Background})`;

const app = (
	<StrictMode>
		<App />
	</StrictMode>
);

if (import.meta.hot) {
	// With hot module reloading, `import.meta.hot.data` is persisted.
	// biome-ignore lint/suspicious/noAssignInExpressions: Bun generated this and I don't know any better.
	const root = (import.meta.hot.data.root ??= createRoot(elem));

	root.render(app);
} else {
	// The hot module reloading API is not available in production.
	createRoot(elem).render(app);
}
