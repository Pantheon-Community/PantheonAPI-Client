import { type FC, useState } from "react";
import { DialogBase } from "./DialogBase";
import "./ErrorDialog.css";
import type { ErrorData } from "@/contexts/Global/GlobalTypes";
import { useHighlightOn } from "@/hooks/useHighlightOn";

interface ErrorDialogProps {
	errorData: ErrorData;

	onClose: () => void;
}

export const ErrorDialog: FC<ErrorDialogProps> = ({ errorData, onClose }) => {
	const { error, status } = errorData;

	const { title, description, ...rest } = error;

	const [isShowingExtra, setIsShowingExtra] = useState(false);

	useHighlightOn(isShowingExtra);

	return (
		<DialogBase title={title} onClose={onClose}>
			<p>{description}</p>

			{Object.keys(rest).length > 0 && (
				<details
					open={isShowingExtra}
					onToggle={(e) => setIsShowingExtra(e.newState === "open")}
				>
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
