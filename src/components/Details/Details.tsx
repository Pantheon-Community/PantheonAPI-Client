import { useCallback, useState } from "react";

interface DetailsProps {
    summaryWhenClosed: string;

    summaryWhenOpen: string;

    children: React.ReactNode;

    open?: boolean;
}

/** A `<details>` element with summary text that changes when opened. */
export const Details: React.FC<DetailsProps> = (props) => {
    const { summaryWhenClosed, summaryWhenOpen, children, open } = props;

    const [isOpen, setIsOpen] = useState(open);

    const handleToggle = useCallback((e: React.ToggleEvent<HTMLDetailsElement>) => {
        setIsOpen(e.newState === "open");
    }, []);

    return (
        <details className="details" open={isOpen} onToggle={handleToggle}>
            <summary>{isOpen ? summaryWhenOpen : summaryWhenClosed}</summary>

            {children}
        </details>
    );
};
