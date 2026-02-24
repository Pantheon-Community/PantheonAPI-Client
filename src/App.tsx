import { Navbar } from "./components/Navbar";
import "./index.css";

export const App = () => (
	<>
		<Navbar />

		<div className="app">
			<h1>Bun + React</h1>
			<p>
				Edit <code>src/App.tsx</code> and save to test HMR
			</p>
		</div>
	</>
);
