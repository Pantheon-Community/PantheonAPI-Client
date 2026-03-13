import { makeTimeout } from "@/utils/makeTimeout";
import { useCallback, useEffect, useState } from "react";
import "./CopyTextButton.css";

export const CopyTextButton: React.FC<{ text: string }> = ({ text }) => {
    const [clickedTimes, setClickedTimes] = useState(0);

    const handleClick = useCallback(async () => {
        setClickedTimes((prev) => prev + 1);

        await navigator.clipboard.writeText(text);
    }, [text]);

    useEffect(() => {
        if (clickedTimes === 0) return;

        return makeTimeout(setClickedTimes, 800, 0);
    }, [clickedTimes]);

    return (
        <button
            className={`copy-text-button ${clickedTimes > 0 ? "clicked" : ""}`}
            type="button"
            onClick={handleClick}
            title="Copy this text"
        >
            {clickedTimes > 0 ? "Copied" : "Copy"}
        </button>
    );
};
