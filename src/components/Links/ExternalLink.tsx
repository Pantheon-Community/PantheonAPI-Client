import type { AnchorHTMLAttributes, FC } from "react";

type ExternalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "rel">;

export const ExternalLink: FC<ExternalLinkProps> = (props) => (
	<a rel="noopener noreferrer" {...props} />
);
