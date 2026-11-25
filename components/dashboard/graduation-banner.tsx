"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface GraduationBannerProps {
	userName: string;
	cgpa: number;
}

export function GraduationBanner({ userName, cgpa }: GraduationBannerProps) {
	const [dismissed, setDismissed] = useState(true); // default hidden to prevent flash

	useEffect(() => {
		const stored = localStorage.getItem("graduation-banner-dismissed");
		setDismissed(stored === "true");
	}, []);

	// Set CSS custom property so TopNav can react to banner visibility
	useEffect(() => {
		document.documentElement.style.setProperty("--banner-offset", dismissed ? "0px" : "32px");
		return () => {
			document.documentElement.style.removeProperty("--banner-offset");
		};
	}, [dismissed]);

	const handleDismiss = () => {
		setDismissed(true);
		localStorage.setItem("graduation-banner-dismissed", "true");
	};

	if (dismissed) return null;

	const message = `🎓 Congratulations ${userName}! You've completed all 8 semesters with a CGPA of ${cgpa.toFixed(2)} — Well done! 🎉`;

	return (
		<div className="fixed top-0 right-0 left-0 z-[60] overflow-hidden border-b border-slate-200 bg-slate-100 text-slate-600">
			<div className="relative flex h-8 items-center">
				{/* Marquee track */}
				<div className="flex-1 overflow-hidden">
					<div className="marquee-track flex whitespace-nowrap">
						{Array.from({ length: 4 }, (_, i) => (
							<span key={i} className="inline-block px-12 text-xs font-normal tracking-wide">
								{message}
							</span>
						))}
					</div>
				</div>

				{/* Close button */}
				<button
					type="button"
					onClick={handleDismiss}
					className="absolute top-1/2 right-2 flex h-5 w-5 flex-shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-slate-200 text-slate-500 transition-colors hover:bg-slate-300"
					aria-label="Dismiss banner"
				>
					<X className="h-3 w-3" />
				</button>
			</div>
		</div>
	);
}
