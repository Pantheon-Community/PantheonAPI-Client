import { useEffect, useState } from "react";
import { DialogBase } from "../DialogBase/DialogBase";

interface RateLimitedDialogProps {
    endsAt: number;

    onClose: () => void;
}

function calculateExpiresIn(endsAt: number): number {
    const result = Math.ceil((endsAt - Date.now()) / 1000);

    // -0 avoidance
    if (result === 0) return 0;
    return result;
}

export const RateLimitedDialog: React.FC<RateLimitedDialogProps> = ({ endsAt, onClose }) => {
    const [expiresIn, setExpiresIn] = useState(() => calculateExpiresIn(endsAt));

    useEffect(() => {
        const interval = setInterval(() => setExpiresIn(calculateExpiresIn(endsAt)), 1000);

        return () => clearInterval(interval);
    }, [endsAt]);

    return (
        <DialogBase title="Rate Limited" onClose={onClose}>
            <p>Too many requests being made to the API.</p>

            <p>
                You can make requests again in <b>{expiresIn.toLocaleString()}</b> second
                {expiresIn !== 1 ? "s" : ""}.
            </p>
        </DialogBase>
    );
};
