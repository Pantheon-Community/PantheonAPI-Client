import { useLocationHash } from "@/hooks/useLocationHash";
import { InternalLink } from "../Links/InternalLink/InternalLink";
import "./LinkGroup.css";

export interface LinkGroupItem {
    label: string;

    hash: string;
}

export const LinkGroup: React.FC<{ options: LinkGroupItem[] }> = ({ options }) => {
    const hash = useLocationHash();

    return (
        <nav className="link-group">
            {options.map((option) => (
                <InternalLink
                    key={option.hash}
                    href={`#${option.hash}`}
                    className={option.hash === hash ? "selected" : undefined}
                    replace
                >
                    {option.label}
                </InternalLink>
            ))}
        </nav>
    );
};
