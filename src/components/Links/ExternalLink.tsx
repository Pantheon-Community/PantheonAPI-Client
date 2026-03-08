interface ExternalLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "rel"> {
    title: string;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({ title, ...props }) => (
    <a rel="noopener noreferrer" title={title} {...props} />
);
