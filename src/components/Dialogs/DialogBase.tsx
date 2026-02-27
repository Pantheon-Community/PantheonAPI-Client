import { type FC, type ReactNode, useEffect, useRef } from "react";
import "./DialogBase.css";

interface DialogBaseProps {
	title: string;

	children: ReactNode;

	onClose(): void;
}

export const DialogBase: FC<DialogBaseProps> = ({ title, children, onClose }) => {
	const ref = useRef<HTMLDialogElement>(null);

	useEffect(() => ref.current?.showModal(), []);

	return (
		<dialog ref={ref} onClose={onClose} closedby="any">
			<div className="dialog-base">
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
