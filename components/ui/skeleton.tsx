'use client'

import { cn } from '@/p4_auth_payment_free/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-800', className)}
      {...props}
    />
  )
}

// Skeleton variants
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800">
      <Skeleton className="h-6 w-1/3 rounded-lg" />
      <Skeleton className="mt-3 h-4 w-full rounded-lg" />
      <Skeleton className="mt-2 h-4 w-2/3 rounded-lg" />
      <Skeleton className="mt-4 h-10 w-full rounded-lg" />
    </div>
  )
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full rounded-lg" />
      ))}
    </div>
  )
}

function SkeletonAvatar() {
  return <Skeleton className="h-10 w-10 rounded-full" />
}

export { Skeleton, SkeletonCard, SkeletonText, SkeletonAvatar }