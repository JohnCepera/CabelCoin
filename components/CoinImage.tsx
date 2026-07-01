import Image from "next/image";

/** Увеличение, чтобы обрезать белую обводку по краю PNG */
const COIN_ZOOM = 1.22;

interface CoinImageProps {
  src: string;
  alt: string;
  size?: "tap" | "preview";
  className?: string;
}

const sizeClasses = {
  tap: "h-48 w-48",
  preview: "h-11 w-11",
};

export function CoinImage({
  src,
  alt,
  size = "tap",
  className = "",
}: CoinImageProps) {
  const dimension = size === "tap" ? 192 : 44;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full ${sizeClasses[size]} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={dimension}
        height={dimension}
        unoptimized
        className="h-full w-full object-cover"
        style={{
          background: "transparent",
          transform: `scale(${COIN_ZOOM})`,
        }}
      />
    </div>
  );
}
