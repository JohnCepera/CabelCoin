import Image from "next/image";

/**
 * Баланс масштаба:
 * ~1.0  — чёрные поля по краям (монета мелкая)
 * ~1.22 — видна белая обводка PNG
 * ~1.26 — монета крупная, белое кольцо обрезано
 */
const COIN_ZOOM = {
  tap: 1.24,
  preview: 1.2,
} as const;

interface CoinImageProps {
  src: string;
  alt: string;
  size?: "tap" | "preview";
  className?: string;
}

const sizeClasses = {
  tap: "h-[13.5rem] w-[13.5rem]",
  preview: "h-11 w-11",
};

export function CoinImage({
  src,
  alt,
  size = "tap",
  className = "",
}: CoinImageProps) {
  const dimension = size === "tap" ? 216 : 44;
  const zoom = COIN_ZOOM[size];

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
        className="h-full w-full object-cover object-center"
        style={{
          background: "transparent",
          transform: `scale(${zoom})`,
        }}
      />
    </div>
  );
}
