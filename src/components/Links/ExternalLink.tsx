import type { FC, HTMLAttributeAnchorTarget, ReactNode } from "react";

interface ExternalLinkProps {
	href: string;

	title: string;

	children: ReactNode;

	target?: HTMLAttributeAnchorTarget;
}

export const ExternalLink: FC<ExternalLinkProps> = ({ href, title, children, target }) => (
	<a rel="noopener noreferrer" href={href} title={title} target={target ?? "_blank"}>
		{children}
	</a>
);
