import { ExternalLink } from "../ExternalLink/ExternalLink";
import "./InlineExternalLink.css";

interface InlineExternalLinkProps {
    href: string;

    title: string;

    children: string;
}

export const InlineExternalLink: React.FC<InlineExternalLinkProps> = (props) => {
    const { href, title, children } = props;

    return (
        <ExternalLink href={href} title={title} target="_blank" className="inline-external-link">
            <span>{children}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <path d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
        </ExternalLink>
    );
};
