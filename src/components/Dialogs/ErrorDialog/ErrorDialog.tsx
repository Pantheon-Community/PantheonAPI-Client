import { CopyTextButton } from "@/components/Buttons/CopyTextButton/CopyTextButton";
import { LogoutButton } from "@/components/Buttons/LogoutButton/LogoutButton";
import { CodeBlock } from "@/components/CodeBlock/CodeBlock";
import { Details } from "@/components/Details/Details";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { usePantheonApi } from "@/contexts/PantheonApi/PantheonApiContext";
import type { PantheonErrorData } from "@/types/PantheonErrorData";
import { Fragment, useMemo } from "react";
import { DialogBase } from "../DialogBase/DialogBase";
import "./ErrorDialog.css";

export const ErrorDialog: React.FC<{ errorData: PantheonErrorData }> = ({ errorData }) => {
    const { currentUser } = useCurrentUser();

    const { error, status, suggestLogout, close } = errorData;

    const { title, description, ...rest } = error;

    const asHtml = useMemo(() => {
        if (!description.startsWith("<!DOCTYPE html>")) return null;

        const parser = new DOMParser();

        const virtualDoc = parser.parseFromString(description, "text/html");

        const codeElements = virtualDoc.getElementsByTagName("pre");

        const textAreaElement = document.createElement("textarea");

        if (codeElements.length === 0) {
            textAreaElement.innerHTML = virtualDoc.body.innerHTML;
        } else {
            textAreaElement.innerHTML = Array.from(codeElements)
                .map((e) => e.innerHTML)
                .join("<br><br>");
        }

        return textAreaElement.value.split("<br>");
    }, [description]);

    return (
        <DialogBase title={title} onClose={close}>
            {asHtml !== null ? (
                <div className="error-dialog-html-display">
                    <pre>
                        {asHtml.map((x, i) => (
                            // oxlint-disable-next-line react/no-array-index-key
                            <Fragment key={i}>
                                {x}
                                <br />
                            </Fragment>
                        ))}
                    </pre>
                    <CopyTextButton text={asHtml.join("\n")} />
                </div>
            ) : (
                <p>{description}</p>
            )}

            {Object.keys(rest).length > 0 && (
                <Details
                    summaryWhenClosed="Show Additional Details"
                    summaryWhenOpen="Hide Additional Details"
                >
                    <CodeBlock>{rest}</CodeBlock>
                </Details>
            )}

            {(status || (suggestLogout && currentUser !== null)) && (
                <div className="error-dialog-rest">
                    {status && (
                        <p className="error-dialog-status-text">
                            HTTP {status.code}
                            {!!status.text && ` - ${status.text}`}
                        </p>
                    )}

                    {suggestLogout && currentUser !== null && <LogoutButton extraOnClick={close} />}
                </div>
            )}
        </DialogBase>
    );
};

export const WrappedErrorDialog: React.FC = () => {
    const { latestError } = usePantheonApi();

    if (latestError === null) {
        return null;
    }

    return <ErrorDialog errorData={latestError} />;
};
