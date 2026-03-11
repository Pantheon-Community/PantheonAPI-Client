import { CopyTextButton } from "../Buttons/CopyTextButton";

interface ExternalLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "rel"> {
    title: string;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({ title, ...props }) => (
    <a rel="noopener noreferrer" title={title} {...props} />
);

export const CopyableExternalLink: React.FC<ExternalLinkProps> = ({ href, children, ...props }) => (
    <ExternalLink href={href} {...props}>
        {children}

        {!!href && <CopyTextButton text={href} />}
    </ExternalLink>
);
