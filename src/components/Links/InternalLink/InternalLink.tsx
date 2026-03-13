import { NavLink, type NavLinkProps } from "react-router";

interface InternalLinkProps extends Omit<
    NavLinkProps & React.RefAttributes<HTMLAnchorElement>,
    "to"
> {
    href: NavLinkProps["to"];
}

export const InternalLink: React.FC<InternalLinkProps> = ({ href, children }) => (
    <NavLink to={href}>{children}</NavLink>
);
