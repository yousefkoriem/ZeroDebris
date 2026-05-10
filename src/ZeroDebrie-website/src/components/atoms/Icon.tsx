import * as icons from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IconProps {
  name: keyof typeof icons;
  className?: string;
  size?: number;
  color?: string;
}

export function Icon({ name, className, size = 24, color = "currentColor" }: IconProps) {
  const LucideIcon = icons[name] as any;

  if (!LucideIcon) {
    console.error(`Icon "${name}" is not a valid lucide-react icon.`);
    const FallbackIcon = icons['CircleHelp'] as any;
    if (!FallbackIcon) return <span style={{ width: size, height: size, display: 'inline-block', backgroundColor: 'red' }} />;
    return <FallbackIcon color={color} size={size} className={cn(className)} role="img" aria-label={name} />;
  }

  return (
    <LucideIcon
      color={color}
      size={size}
      className={cn(className)}
      role="img"
      aria-label={name}
    />
  );
}
