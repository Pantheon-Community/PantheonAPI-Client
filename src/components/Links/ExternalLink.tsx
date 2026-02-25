import type { FC, ReactNode } from "react";

interface ExternalLinkProps {
	href: string;

	title: string;

	children: ReactNode;
}

export const ExternalLink: FC<ExternalLinkProps> = ({ href, title, children }) => (
	<a rel="noopener noreferrer" href={href} title={title} target="_blank">
		{children}
	</a>
);
