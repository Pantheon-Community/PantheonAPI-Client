import { type FC, Fragment, useMemo, useState } from "react";
import { DialogBase } from "./DialogBase";
import "./ErrorDialog.css";
import type { ApiErrorData } from "@/contexts/PantheonApi/ApiErrorData";
import { CopyTextButton } from "../Buttons/CopyTextButton";
import { CodeBlock } from "../CodeBlock/CodeBlock";

interface ErrorDialogProps {
	errorData: ApiErrorData;

	onClose: () => void;
}

export const ErrorDialog: FC<ErrorDialogProps> = ({ errorData, onClose }) => {
	const { error, status } = errorData;

	const { title, description, ...rest } = error;

	const [isShowingExtra, setIsShowingExtra] = useState(false);

	const asHtml = useMemo(() => {
		if (!description.startsWith("<!DOCTYPE html>")) return null;

		const parser = new DOMParser();

		const virtualDoc = parser.parseFromString(description, "text/html");

		const codeElements = virtualDoc.getElementsByTagName("pre");

		const textAreaElement = document.createElement("textarea");

		if (codeElements.length === 0) {
			textAreaElement.innerHTML = virtualDoc.body.innerHTML;
		} else {
			textAreaElement.innerHTML = Array.from(codeElements)
				.map((e) => e.innerHTML)
				.join("<br><br>");
		}

		return textAreaElement.value.split("<br>");
	}, [description]);

	return (
		<DialogBase title={title} onClose={onClose}>
			{asHtml !== null ? (
				<div className="error-dialog-html-display">
					<pre>
						{asHtml.map((x, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: nothing else to index
							<Fragment key={i}>
								{x}
								<br />
							</Fragment>
						))}
					</pre>
					<CopyTextButton text={asHtml.join("\n")} />
				</div>
			) : (
				<p>{description}</p>
			)}

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
