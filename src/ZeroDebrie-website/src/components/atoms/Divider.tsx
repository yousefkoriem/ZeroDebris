import { cn } from "@/lib/utils"

export function Divider({ className, orientation = 'horizontal' }: { className?: string, orientation?: 'horizontal' | 'vertical' }) {
  return (
    <div
      className={cn(
        "bg-border shrink-0",
        orientation === 'horizontal' ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      role="separator"
    />
  );
}
