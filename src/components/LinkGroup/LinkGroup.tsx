import { useHash } from "@/hooks/useHash";
import { InternalLink } from "../Links/InternalLink";
import "./LinkGroup.css";

export interface LinkGroupItem {
    label: React.ReactNode;

    hash: string;
}

interface LinkGroupProps {
    options: LinkGroupItem[];
}

export const LinkGroup: React.FC<LinkGroupProps> = ({ options }) => {
    const hash = useHash();

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
