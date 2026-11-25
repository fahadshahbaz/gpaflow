"use client";

import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GPACircularChartProps {
	cgpa: number;
	targetGpa: number;
}

export function GPACircularChart({ cgpa, targetGpa }: GPACircularChartProps) {
	const percentage = Math.min((cgpa / 4.0) * 100, 100);
	const circumference = 2 * Math.PI * 45;
	const _strokeDashoffset = circumference - (percentage / 100) * circumference;

	return (
		<Card className="col-span-12 rounded-xl border-[#262626] bg-[#141414] lg:col-span-4">
			<CardHeader className="pb-2">
				<div className="flex items-center gap-2">
					<Target className="h-4 w-4 text-gray-500" />
					<CardTitle className="text-sm font-medium text-white">Progress</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="flex items-center justify-center py-4">
				<div className="relative">
					<svg
						width="140"
						height="140"
						className="-rotate-90 transform"
						role="img"
						aria-label={`GPA Progress: ${cgpa.toFixed(2)} of 4.0`}
					>
						<title>GPA Progress Chart</title>
						{/* Background circle */}
						<circle cx="70" cy="70" r="55" stroke="#1a1a1a" strokeWidth="10" fill="none" />
						{/* Progress circle */}
						<circle
							cx="70"
							cy="70"
							r="55"
							stroke="var(--primary)"
							strokeWidth="10"
							fill="none"
							strokeLinecap="round"
							strokeDasharray={2 * Math.PI * 55}
							strokeDashoffset={2 * Math.PI * 55 - (percentage / 100) * 2 * Math.PI * 55}
							className="transition-all duration-500"
						/>
					</svg>

					{/* Center content */}
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<span className="text-3xl font-semibold text-white">{cgpa.toFixed(2)}</span>
						<span className="text-xs text-gray-500">of 4.0</span>
					</div>
				</div>
			</CardContent>

			{/* Stats below */}
			<div className="grid grid-cols-2 gap-3 px-4 pb-4">
				<div className="rounded-lg bg-[#1a1a1a] p-2.5 text-center">
					<p className="text-xl font-semibold text-white">
						{((cgpa / targetGpa) * 100).toFixed(0)}%
					</p>
					<p className="text-xs text-gray-500">To Target</p>
				</div>
				<div className="rounded-lg bg-[#1a1a1a] p-2.5 text-center">
					<p className="text-primary text-xl font-semibold">
						{Math.max(targetGpa - cgpa, 0).toFixed(2)}
					</p>
					<p className="text-xs text-gray-500">Points Needed</p>
				</div>
			</div>
		</Card>
	);
}
