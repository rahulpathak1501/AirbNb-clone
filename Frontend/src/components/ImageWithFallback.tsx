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

  return (
    <div className={`image-fallback-wrapper ${className}`}>
      {/* Blurred placeholder */}
      {!loaded && (
        <img
          src={defaultImage}
          alt="placeholder"
          className="blurred-placeholder fade-in"
        />
      )}

      {/* Main image */}
      <img
        src={error ? defaultImage : src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        className={`main-image ${loaded ? "visible" : "hidden"}`}
      />
    </div>
  );
};

export default ImageWithFallback;
