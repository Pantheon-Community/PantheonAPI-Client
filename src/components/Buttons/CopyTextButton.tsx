import type { FC } from "react";

interface CopyTextButtonProps {
	text: string;
}

export const CopyTextButton: FC<CopyTextButtonProps> = ({ text }) => (
	<button
		className="copy-text-button"
		type="button"
		onClick={() => {
			navigator.clipboard.writeText(text);
		}}
	>
		Copy
	</button>
);
