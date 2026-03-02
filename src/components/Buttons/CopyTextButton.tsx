import { type FC, useCallback, useEffect, useState } from "react";
import "./CopyTextButton.css";

interface CopyTextButtonProps {
	text: string;
}

export const CopyTextButton: FC<CopyTextButtonProps> = ({ text }) => {
	const [clickedTimes, setClickedTimes] = useState(0);

	const handleClick = useCallback(() => {
		setClickedTimes((prev) => prev + 1);
		navigator.clipboard.writeText(text);
	}, [text]);

	useEffect(() => {
		if (clickedTimes === 0) return;

		const timeout = setTimeout(setClickedTimes, 800, 0);

		return () => clearTimeout(timeout);
	}, [clickedTimes]);

	return (
		<button
			className={`copy-text-button ${clickedTimes > 0 ? "clicked" : ""}`}
			type="button"
			onClick={handleClick}
		>
			{clickedTimes > 0 ? "Copied!" : "Copy"}
		</button>
	);
};
