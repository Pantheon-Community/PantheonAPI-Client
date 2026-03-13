import { useCallback, useEffect, useMemo, useState } from "react";

interface StatefulButtonProps extends Omit<
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    "children"
> {
    onClick(e: React.MouseEvent<HTMLButtonElement>): Promise<void>;

    /** @example "Load" */
    textDo: string;

    /** @example "Loading..." */
    textDoing: string;

    /** @example "Loaded!" */
    textDone: string;
}

/** A `<button>` element with state dependent on an asynchronous action. */
export const StatefulButton: React.FC<StatefulButtonProps> = (props) => {
    const { onClick, disabled, textDo, textDoing, textDone, ...rest } = props;

    const [isDoingThing, setIsDoingThing] = useState(false);
    const [justDidThing, setJustDidThing] = useState(false);

    const handleClick = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement>) => {
            setIsDoingThing(true);

            try {
                await onClick(e);
                setJustDidThing(true);
            } finally {
                setIsDoingThing(false);
            }
        },
        [onClick],
    );

    useEffect(() => {
        if (!justDidThing) return;

        const timeout = setTimeout(setJustDidThing, 2_000, false);

        return () => clearTimeout(timeout);
    }, [justDidThing]);

    const text = useMemo(() => {
        if (justDidThing) return textDone;
        if (isDoingThing) return textDoing;
        return textDo;
    }, [textDone, textDo, justDidThing, textDoing, isDoingThing]);

    return (
        <button onClick={handleClick} disabled={disabled || isDoingThing || justDidThing} {...rest}>
            {text}
        </button>
    );
};
