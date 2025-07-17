import React, { useState } from "react";
import "../style/ImageWithFallback.css";
import defaultImage from "../assets/default-property.jpg";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

const ImageWithFallback: React.FC<Props> = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => setLoaded(true);
  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  return (
    <div className={`blur-image-container ${className}`}>
      <img
        src={error ? defaultImage : src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`blur-image ${loaded ? "loaded" : "loading"}`}
      />
    </div>
  );
};

export default ImageWithFallback;
