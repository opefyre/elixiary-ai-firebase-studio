import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = "h-6 w-6", width, height }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Elixiary AI Logo"
      width={width || 24}
      height={height || 24}
      className={className}
      priority
    />
  );
}
