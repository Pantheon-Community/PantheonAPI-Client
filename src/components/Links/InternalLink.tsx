import type { FC, ReactNode } from "react";
import { NavLink } from "react-router";

interface InternalLinkProps {
	href: string;

	children: ReactNode;
}

export const InternalLink: FC<InternalLinkProps> = ({ href, children }) => (
	<NavLink to={href}>{children}</NavLink>
);
