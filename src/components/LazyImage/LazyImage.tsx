import type { SiteImageData } from "@/types/SiteImageData";
import { useCallback, useEffect, useState } from "react";
import "./LazyImage.css";

interface LazyImageProps {
    primary: SiteImageData | null;

    fallback?: SiteImageData;

    title?: string;

    className?: string;

    style?: React.CSSProperties;
}

export const LazyImage: React.FC<LazyImageProps> = (props) => {
    const { primary, fallback, title, className, style } = props;

    const [chosen, setChosen] = useState<SiteImageData>();

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => setChosen(primary ?? fallback), [fallback, primary]);

    const handleLoad = useCallback(() => setIsVisible(true), []);

    const handleError = useCallback(() => setChosen(fallback), [fallback]);

    return (
        <div
            className={`lazy-image${isVisible ? " loaded" : ""} ${className ?? ""}`}
            title={title}
            style={style}
        >
            <img
                src={chosen?.src}
                alt={chosen?.alt}
                loading="lazy"
                onLoad={handleLoad}
                onError={handleError}
            />
        </div>
    );
};
