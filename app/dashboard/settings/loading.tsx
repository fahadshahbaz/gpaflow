import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
	return <div className={cn("bg-slate-200/60 rounded-xl", className)} />;
}

export default function SettingsLoading() {
	return (
		<div className="flex min-h-[calc(100vh-4rem)] justify-center p-6 pt-16 sm:items-center sm:pt-0">
			<div className="t-skel-skeleton is-pulsing mx-auto w-full max-w-xl">
				{/* Settings Card */}
				<div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
					{/* Avatar / Profile Header */}
					<div className="flex items-center gap-5 border-b border-slate-100 p-8">
						<Skeleton className="h-20 w-20 flex-shrink-0 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-7 w-48" />
							<Skeleton className="h-4 w-32" />
						</div>
					</div>

					{/* Form Section */}
					<div className="space-y-6 p-8">
						{/* Name Field */}
						<div>
							<Skeleton className="mb-3 h-4 w-28" />
							<Skeleton className="h-12 w-full" />
						</div>

						{/* Email Field */}
						<div>
							<Skeleton className="mb-3 h-4 w-28" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="mt-3 h-3 w-40" />
						</div>

						{/* Submit Button */}
						<div className="pt-2">
							<Skeleton className="h-11 w-full" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
