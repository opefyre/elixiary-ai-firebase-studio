'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export type RecipeImageProps = ImageProps;

export function RecipeImage({
  className,
  onError,
  sizes,
  style,
  ...props
}: RecipeImageProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <Image
      {...props}
      sizes={sizes ?? '100vw'}
      className={cn(
        'absolute inset-0 h-full w-full object-cover object-center',
        className
      )}
      style={{
        objectFit: 'cover',
        objectPosition: 'center',
        ...style,
      }}
      onError={(event) => {
        setIsVisible(false);
        onError?.(event);
      }}
    />
  );
}
