import type { FC, ReactNode } from "react";
import "./DialogBase.css";

interface DialogBaseProps {
	title: string;

	children: ReactNode;

	onClose(): void;
}

export const DialogBase: FC<DialogBaseProps> = ({ title, children, onClose }) => (
	<div className="dialog-wrapper">
		<dialog onClose={onClose} open closedby="any">
			<h2>
				<span>{title}</span>

				<button onClick={onClose} className="close-button" type="button">
					Close
				</button>
			</h2>

			<div>{children}</div>
		</dialog>
	</div>
);
