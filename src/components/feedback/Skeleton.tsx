export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-surface-2 ${className}`} aria-hidden="true" />;
}

export function CardSkeleton() {
  return (
    <div className="card space-y-3 p-5">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="card flex flex-wrap items-start gap-5 p-6" role="status" aria-label="Loading profile">
      <Skeleton className="h-20 w-20 shrink-0 rounded-full" />
      <div className="min-w-[240px] flex-1 space-y-2.5 py-1">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card divide-y divide-line" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/6" />
        </div>
      ))}
    </div>
  );
}
