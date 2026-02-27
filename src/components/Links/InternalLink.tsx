import type { AnchorHTMLAttributes, FC } from "react";
import { NavLink } from "react-router";

type InternalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
	Pick<Required<AnchorHTMLAttributes<HTMLAnchorElement>>, "href">;

export const InternalLink: FC<InternalLinkProps> = ({ href, ...rest }) => (
	<NavLink to={href} {...rest} />
);
