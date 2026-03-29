import { useEffect, useRef } from "react";
import "./DialogBase.css";

interface DialogBaseProps {
    title: string;

    children: React.ReactNode;

    isBad: boolean;

    wide?: boolean;

    onClose(): void;
}

export const DialogBase: React.FC<DialogBaseProps> = ({
    title,
    children,
    isBad,
    wide,
    onClose,
}) => {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => ref.current?.showModal(), []);

    return (
        <dialog ref={ref} onClose={onClose} closedby="any" className={wide ? "wide" : undefined}>
            <div className={`dialog-base-contents ${isBad ? "is-bad" : ""}`}>
                <h2>
                    <span>{title}</span>

                    <button onClick={onClose} className="close-button" type="button">
                        Close
                    </button>
                </h2>

                <div>{children}</div>
            </div>
        </dialog>
    );
};
