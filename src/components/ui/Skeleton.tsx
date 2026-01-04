export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-foreground/10 rounded-md ${className}`} />;
}
