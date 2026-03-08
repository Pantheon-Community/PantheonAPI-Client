import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import type { ApiErrorData } from "@/contexts/PantheonApi/ApiErrorData";
import { usePantheonApi } from "@/contexts/PantheonApi/PantheonApiContext";
import { Fragment, useCallback, useMemo, useState } from "react";
import { CopyTextButton } from "../Buttons/CopyTextButton";
import { LogoutButton } from "../Buttons/LogoutButton";
import { CodeBlock } from "../CodeBlock/CodeBlock";
import { DialogBase } from "./DialogBase";
import "./ErrorDialog.css";

interface ErrorDialogProps {
    errorData: ApiErrorData;

    onClose: () => void;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({ errorData, onClose }) => {
    const { currentUser } = useCurrentUser();

    const { error, status, isAuthRelated } = errorData;

    const { title, description, ...rest } = error;

    const [isShowingExtra, setIsShowingExtra] = useState(false);

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

    const handleToggle = useCallback((e: React.ToggleEvent<HTMLDetailsElement>) => {
        setIsShowingExtra(e.newState === "open");
    }, []);

    return (
        <DialogBase title={title} onClose={onClose}>
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
                <details open={isShowingExtra} onToggle={handleToggle}>
                    <summary>{isShowingExtra ? "Hide" : "Show"} Additional Details</summary>

                    <CodeBlock>{rest}</CodeBlock>
                </details>
            )}

            {(status || (isAuthRelated && currentUser !== null)) && (
                <div className="error-dialog-rest">
                    {status && (
                        <p className="error-dialog-status-text">
                            HTTP {status.code}
                            {status.text && ` - ${status.text}`}
                        </p>
                    )}

                    {isAuthRelated && currentUser !== null && (
                        <LogoutButton extraOnClick={onClose} />
                    )}
                </div>
            )}
        </DialogBase>
    );
};

export const WrappedErrorDialog: React.FC = () => {
    const { latestError, handleErrorClose } = usePantheonApi();

    if (latestError === null) {
        return null;
    }

    return <ErrorDialog errorData={latestError} onClose={handleErrorClose} />;
};
