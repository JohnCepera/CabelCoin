import Image from "next/image";

interface CoinImageProps {
  src: string;
  alt: string;
  size?: "tap" | "preview";
  className?: string;
}

const sizeClasses = {
  tap: "h-44 w-44",
  preview: "h-10 w-10",
};

export function CoinImage({
  src,
  alt,
  size = "tap",
  className = "",
}: CoinImageProps) {
  const dimension = size === "tap" ? 176 : 40;

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
        style={{ background: "transparent" }}
      />
    </div>
  );
}
