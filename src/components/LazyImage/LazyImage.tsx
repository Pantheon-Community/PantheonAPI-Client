import { useCallback, useEffect, useState } from "react";
import "./LazyImage.css";

interface ImageProps extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "src" | "loading" | "onLoad" | "onError"
> {
    primarySrc: string | undefined | null;

    alt: string;

    fallbackSrc?: string;
}

export const LazyImage: React.FC<ImageProps> = ({ primarySrc, fallbackSrc, alt, ...rest }) => {
    const [chosenSrc, setChosenSrc] = useState<string>();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (primarySrc) setChosenSrc(primarySrc);
    }, [primarySrc]);

    const handleLoad = useCallback(() => setIsVisible(true), []);

    const handleError = useCallback(() => {
        if (chosenSrc !== fallbackSrc && fallbackSrc) {
            setChosenSrc(fallbackSrc);
        }
    }, [chosenSrc, fallbackSrc]);

    return (
        <div className={`lazy-image ${rest.className} ${isVisible ? "loaded" : ""}`}>
            <img
                src={chosenSrc}
                loading="lazy"
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                {...rest}
            />
        </div>
    );
};
