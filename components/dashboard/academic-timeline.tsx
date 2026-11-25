"use client";

import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Semester } from "@/types/grading";

interface AcademicTimelineProps {
	semesters: Semester[];
}

export function AcademicTimeline({ semesters }: AcademicTimelineProps) {
	const sortedSemesters = [...semesters].sort((a, b) => a.semester_number - b.semester_number);

	// Demo data if no real data
	const demoSemesters = [
		{
			id: "1",
			name: "S1",
			sgpa: 3.2,
			total_credit_hours: 15,
			semester_number: 1,
		},
		{
			id: "2",
			name: "S2",
			sgpa: 3.5,
			total_credit_hours: 18,
			semester_number: 2,
		},
		{
			id: "3",
			name: "S3",
			sgpa: 3.6,
			total_credit_hours: 16,
			semester_number: 3,
		},
		{
			id: "4",
			name: "S4",
			sgpa: 3.4,
			total_credit_hours: 17,
			semester_number: 4,
		},
		{
			id: "5",
			name: "S5",
			sgpa: 3.7,
			total_credit_hours: 15,
			semester_number: 5,
		},
	];

	const displaySemesters = sortedSemesters.length > 0 ? sortedSemesters : demoSemesters;
	const isDemo = semesters.length === 0;

	return (
		<Card className="col-span-12 rounded-xl border-[#262626] bg-[#141414] lg:col-span-8">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div className="flex items-center gap-2">
					<Calendar className="h-4 w-4 text-gray-500" />
					<CardTitle className="text-sm font-medium text-white">Timeline</CardTitle>
					{isDemo && (
						<span className="rounded bg-[#1a1a1a] px-1.5 py-0.5 text-[10px] text-gray-600">
							Demo
						</span>
					)}
				</div>
				<span className="text-xs text-gray-600">{displaySemesters.length} of 8</span>
			</CardHeader>
			<CardContent className="pt-2">
				<div className="relative">
					{/* Timeline bar */}
					<div className="absolute top-4 right-0 left-0 h-0.5 rounded-full bg-[#1a1a1a]" />

					{/* Progress indicator */}
					<div
						className="bg-primary absolute top-4 left-0 h-0.5 rounded-full transition-all duration-500"
						style={{ width: `${(displaySemesters.length / 8) * 100}%` }}
					/>

					{/* Semester dots */}
					<div className="relative flex justify-between pt-1">
						{displaySemesters.map((semester, index) => (
							<div key={semester.id} className="flex flex-col items-center">
								<div className="border-primary h-3 w-3 rounded-full border-2 bg-[#141414]" />
								<div className="mt-2 text-center">
									<p className="text-[10px] text-gray-600">S{index + 1}</p>
									<p className="text-xs font-medium text-white">{semester.sgpa.toFixed(2)}</p>
								</div>
							</div>
						))}

						{/* Future semesters */}
						{Array.from({
							length: Math.max(0, 8 - displaySemesters.length),
						}).map((_, i) => (
							<div key={`future-${i}`} className="flex flex-col items-center opacity-30">
								<div className="h-3 w-3 rounded-full border border-dashed border-[#333] bg-[#141414]" />
								<div className="mt-2 text-center">
									<p className="text-[10px] text-gray-600">S{displaySemesters.length + i + 1}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Stats */}
				<div className="mt-6 flex items-center gap-6 border-t border-[#1f1f1f] pt-3 text-xs">
					<div>
						<p className="text-gray-600">Completed</p>
						<p className="font-medium text-white">{displaySemesters.length} semesters</p>
					</div>
					<div>
						<p className="text-gray-600">Credits</p>
						<p className="font-medium text-white">
							{displaySemesters.reduce((sum, s) => sum + s.total_credit_hours, 0)}
						</p>
					</div>
					<div>
						<p className="text-gray-600">Average</p>
						<p className="text-primary font-medium">
							{(
								displaySemesters.reduce((sum, s) => sum + s.sgpa, 0) / displaySemesters.length
							).toFixed(2)}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
