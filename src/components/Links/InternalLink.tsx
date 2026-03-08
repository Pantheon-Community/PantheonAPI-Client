import { NavLink, type NavLinkProps } from "react-router";

interface InternalLinkProps extends Omit<NavLinkProps, "to"> {
    href: string;
}

export const InternalLink: React.FC<InternalLinkProps> = ({ href, ...rest }) => (
    <NavLink to={href} {...rest} />
);
