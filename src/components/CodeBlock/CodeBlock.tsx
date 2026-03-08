import hljs from "highlight.js/lib/common";
import { useEffect, useMemo, useRef } from "react";

interface CodeBlockProps {
    children: unknown;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ children }) => {
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
