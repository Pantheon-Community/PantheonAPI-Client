import { NavLink } from "react-router";

interface InternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

export const InternalLink: React.FC<InternalLinkProps> = ({ href, ...rest }) => (
    <NavLink to={href} {...rest} />
);
