import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
	return <div className={cn("bg-slate-200/60 rounded-xl", className)} />;
}

export function DashboardSkeletonContent() {
	return (
		<div className="mx-auto max-w-[1600px] px-6 py-6">
			{/* Welcome Header Skeleton */}
			<div className="mb-6">
				<Skeleton className="mb-2 h-9 w-64" />
				<Skeleton className="h-5 w-48" />
			</div>

			{/* Stats Grid Skeleton */}
			<div className="mb-3 grid grid-cols-12 gap-3">
				<div className="col-span-6 sm:col-span-3">
					<Skeleton className="h-28 rounded-2xl" />
				</div>
				<div className="col-span-6 sm:col-span-3">
					<Skeleton className="h-28 rounded-2xl" />
				</div>
				<div className="col-span-6 sm:col-span-3">
					<Skeleton className="h-28 rounded-2xl" />
				</div>
				<div className="col-span-6 sm:col-span-3">
					<Skeleton className="h-28 rounded-2xl" />
				</div>
			</div>

			{/* Chart + Insights Skeleton */}
			<div className="mb-3 grid grid-cols-12 gap-3">
				<div className="col-span-12 lg:col-span-8">
					<Skeleton className="h-80 rounded-3xl" />
				</div>
				<div className="col-span-12 lg:col-span-4">
					<Skeleton className="h-80 rounded-3xl" />
				</div>
			</div>

			{/* Activity & Grade Skeleton */}
			<div className="grid grid-cols-12 gap-3">
				<div className="col-span-12 md:col-span-6">
					<Skeleton className="h-48 rounded-3xl" />
				</div>
				<div className="col-span-12 md:col-span-6">
					<Skeleton className="h-48 rounded-3xl" />
				</div>
			</div>
		</div>
	);
}
