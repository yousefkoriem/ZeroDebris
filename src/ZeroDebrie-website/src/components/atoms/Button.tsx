import * as React from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-ring disabled:opacity-50 disabled:pointer-events-none",
          {
            'bg-cyan-500 text-bg hover:bg-cyan-500/90': variant === 'default',
            'border border-border bg-transparent hover:bg-elevated text-fg': variant === 'outline',
            'hover:bg-elevated text-fg': variant === 'ghost',
            'bg-danger-500 text-fg hover:bg-danger-500/90': variant === 'danger',
            'bg-elevated text-fg hover:bg-elevated/80': variant === 'secondary',
            'h-9 px-3': size === 'sm',
            'h-10 py-2 px-4': size === 'md',
            'h-11 px-8': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
