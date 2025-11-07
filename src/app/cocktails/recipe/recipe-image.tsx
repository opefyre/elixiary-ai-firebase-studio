'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export type RecipeImageProps = Omit<ImageProps, 'onError'>;

export function RecipeImage({ className, ...props }: RecipeImageProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <Image
      {...props}
      className={cn(className)}
      onError={() => setIsVisible(false)}
    />
  );
}
