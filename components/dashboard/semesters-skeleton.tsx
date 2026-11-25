import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
	return <div className={cn("bg-slate-200/60 rounded-xl", className)} />;
}

export function SemestersSkeletonContent() {
	return (
		<div className="mx-auto max-w-[1600px] px-6 py-8">
			{/* Page Header Skeleton */}
			<div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
				<div>
					<Skeleton className="mb-2 h-9 w-40" />
					<Skeleton className="h-5 w-64" />
				</div>
				<Skeleton className="h-10 w-36 rounded-lg" />
			</div>

			{/* Semester List Card Skeleton */}
			<div className="rounded-3xl border border-slate-200/60 bg-[#f8fafc] p-6 shadow-[inset_0_1.5px_3.5px_rgba(0,0,0,0.04)]">
				<div className="mb-6">
					<Skeleton className="mb-2 h-6 w-40" />
					<Skeleton className="h-4 w-56" />
				</div>

				{/* Semester Items Skeleton */}
				<div className="space-y-4">
					<Skeleton className="h-24 rounded-2xl" />
					<Skeleton className="h-24 rounded-2xl" />
					<Skeleton className="h-24 rounded-2xl" />
				</div>
			</div>
		</div>
	);
}
