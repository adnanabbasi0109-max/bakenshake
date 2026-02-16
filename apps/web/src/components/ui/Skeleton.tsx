interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-brand-cream rounded-brand ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-brand overflow-hidden shadow-sm">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-9 w-24 rounded-brand" />
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-32">
      <Skeleton className="w-28 h-28 rounded-full mx-auto" />
      <Skeleton className="h-4 w-20 mx-auto mt-3" />
    </div>
  );
}
