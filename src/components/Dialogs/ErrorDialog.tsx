import hljs from "highlight.js/lib/common";
import { type FC, type ToggleEvent, useCallback, useRef, useState } from "react";
import { DialogBase } from "./DialogBase";
import "./ErrorDialog.css";
import type { ErrorData } from "@/contexts/Global/GlobalTypes";

interface ErrorDialogProps {
	errorData: ErrorData;

	onClose: () => void;
}

export const ErrorDialog: FC<ErrorDialogProps> = ({ errorData, onClose }) => {
	const { error, status } = errorData;

	const { title, description, ...rest } = error;

	const [isShowingExtra, setIsShowingExtra] = useState(false);

	const hasEverToggled = useRef(false);

	const handleToggle = useCallback((e: ToggleEvent<HTMLDetailsElement>) => {
		setIsShowingExtra(e.newState === "open");

		if (!hasEverToggled.current) {
			hasEverToggled.current = true;
			hljs.highlightAll();
		}
	}, []);

	return (
		<DialogBase title={title} onClose={onClose}>
			<p>{description}</p>

			{Object.keys(rest).length > 0 && (
				<details open={isShowingExtra} onToggle={handleToggle}>
					<summary>{isShowingExtra ? "Hide" : "Show"} Additional Details</summary>

					<pre>
						<code className="language-json">{JSON.stringify(rest, undefined, 4)}</code>
					</pre>
				</details>
			)}

			{status && (
				<p className="status-text">
					HTTP {status.code} - {status.text}
				</p>
			)}
		</DialogBase>
	);
};
