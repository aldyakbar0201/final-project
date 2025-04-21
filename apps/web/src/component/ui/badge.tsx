import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'success'
    | 'destructive'
    | 'warning'
    | 'outline';
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        {
          'bg-primary text-white border-transparent': variant === 'default',
          'bg-gray-100 text-gray-800 border-gray-200': variant === 'secondary',
          'bg-green-100 text-green-800 border-green-200': variant === 'success',
          'bg-red-100 text-red-800 border-red-200': variant === 'destructive',
          'bg-yellow-100 text-yellow-800 border-yellow-200':
            variant === 'warning',
          'text-gray-700 border border-gray-300': variant === 'outline',
        },
        className,
      )}
      {...props}
    />
  );
}
