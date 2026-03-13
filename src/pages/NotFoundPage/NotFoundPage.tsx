import type { SiteImageData } from "@/types/SiteImageData";
import { useRef } from "react";
import amongus from "./images/amongus.png";
import death from "./images/death.png";
import sausage from "./images/sausage.jpg";
import "./NotFoundPage.css";

interface Artwork extends SiteImageData {
    caption: string;
}

const artworks: Artwork[] = [
    {
        src: sausage,
        alt: "Stonehenge made out of sausages and mash potato. Delicious",
        caption: "Unless this is what you were looking for?",
    },
    {
        src: death,
        alt: "A fox avatar sits dead at a table, a revolver is conspicuously placed to the side",
        caption: "We couldn't live with our mistakes.",
    },
    {
        src: amongus,
        alt: "An among us character with really big shoes",
        caption: "@grok is this real?",
    },
];

export const NotFoundPage: React.FC = () => {
    const imageRef = useRef(artworks[Math.floor(Math.random() * artworks.length)]);

    const { caption, src: imageSource, alt } = imageRef.current;

    return (
        <section className="not-found-page">
            <h1>Not Found</h1>

            <p>{caption}</p>

            <img src={imageSource} alt={alt} />
        </section>
    );
};
