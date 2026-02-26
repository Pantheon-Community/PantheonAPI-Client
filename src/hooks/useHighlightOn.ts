import hljs from "highlight.js/lib/common";
import { useEffect, useRef } from "react";

export function useHighlightOn(condition: boolean): void {
	const hasEverHighlighted = useRef(false);

	useEffect(() => {
		if (hasEverHighlighted.current) return;
		if (!condition) return;

		hasEverHighlighted.current = true;
		hljs.highlightAll();
	}, [condition]);
}
