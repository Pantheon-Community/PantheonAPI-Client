import hljs from "highlight.js/lib/common";
import jsonLanguage from "highlight.js/lib/languages/json";
import "highlight.js/styles/atom-one-dark.css";
import { useEffect, useMemo, useRef } from "react";

hljs.registerLanguage("json", jsonLanguage);

/** A `<code>` element with highlighted JSON code. */
export const CodeBlock: React.FC<{ children: unknown }> = ({ children }) => {
    const rawContent = useMemo(() => {
        try {
            return JSON.stringify(children, undefined, 4);
        } catch (error) {
            if (!(error instanceof Error)) {
                throw error;
            }

            return JSON.stringify({ name: error.name, message: error.message });
        }
    }, [children]);

    const lastHighlightedText = useRef("");

    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (elementRef.current === null) return;
        if (lastHighlightedText.current === rawContent) return;

        lastHighlightedText.current = rawContent;

        if (elementRef.current.getAttribute("data-highlighted") === "yes") {
            elementRef.current.removeAttribute("data-highlighted");
        }

        hljs.highlightElement(elementRef.current);
    }, [rawContent]);

    return (
        <pre>
            <code ref={elementRef} className="language-json">
                {rawContent}
            </code>
        </pre>
    );
};
