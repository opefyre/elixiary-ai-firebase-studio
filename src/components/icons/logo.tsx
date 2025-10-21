import Image from "next/image";
import type { ComponentProps } from "react";

type LogoProps = Omit<ComponentProps<typeof Image>, 'src' | 'alt'> & {
  className?: string;
};

export function Logo({ className, ...props }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Elixiary AI Logo"
      width={24}
      height={24}
      className={className}
      {...props}
    />
  );
}
