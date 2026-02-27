import { type FC, useState } from "react";
import { DialogBase } from "./DialogBase";
import "./ErrorDialog.css";
import type { ErrorData } from "@/contexts/Global/GlobalTypes";
import { CodeBlock } from "../CodeBlock/CodeBlock";

interface ErrorDialogProps {
	errorData: ErrorData;

	onClose: () => void;
}

export const ErrorDialog: FC<ErrorDialogProps> = ({ errorData, onClose }) => {
	const { error, status } = errorData;

	const { title, description, ...rest } = error;

	const [isShowingExtra, setIsShowingExtra] = useState(false);

	return (
		<DialogBase title={title} onClose={onClose}>
			<p>{description}</p>

			{Object.keys(rest).length > 0 && (
				<details
					open={isShowingExtra}
					onToggle={(e) => setIsShowingExtra(e.newState === "open")}
				>
					<summary>{isShowingExtra ? "Hide" : "Show"} Additional Details</summary>

					<CodeBlock>{rest}</CodeBlock>
				</details>
			)}

			{status && (
				<p className="error-dialog-status-text">
					HTTP {status.code}
					{status.text && ` - ${status.text}`}
				</p>
			)}
		</DialogBase>
	);
};
