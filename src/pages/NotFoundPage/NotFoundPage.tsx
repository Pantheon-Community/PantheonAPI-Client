import { LazyImage } from "@/components/LazyImage/LazyImage";
import { useRef } from "react";
import amongus from "./images/amongus.png";
import death from "./images/death.png";
import sausage from "./images/sausage.jpg";
import "./NotFoundPage.css";

interface Artwork {
    imageSource: string;

    alt: string;

    caption: string;
}

const artworks: Artwork[] = [
    {
        imageSource: sausage,
        alt: "Stonehenge made out of sausages and mash potato. Delicious",
        caption: "Unless this is what you were looking for?",
    },
    {
        imageSource: death,
        alt: "A fox avatar sits dead at a table, a revolver is conspicuously placed to the side",
        caption: "We couldn't live with our mistakes.",
    },
    {
        imageSource: amongus,
        alt: "An among us character with really big shoes",
        caption: "@grok is this real?",
    },
];

export const NotFoundPage: React.FC = () => {
    const { current: image } = useRef(artworks[Math.floor(Math.random() * artworks.length)]);

    return (
        <section className="not-found-page">
            <h1>Not Found</h1>

            <p>{image.caption}</p>

            <LazyImage primarySrc={image.imageSource} alt={image.alt} />
        </section>
    );
};
