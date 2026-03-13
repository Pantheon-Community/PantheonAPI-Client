type ExternalLinkProps = Omit<
    React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
    "rel"
>;

export const ExternalLink: React.FC<ExternalLinkProps> = ({ children, ...props }) => {
    return (
        <a rel="noopener noreferrer" {...props}>
            {children}
        </a>
    );
};
