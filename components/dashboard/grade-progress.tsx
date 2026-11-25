"use client";

import { Award } from "lucide-react";
import { useMemo } from "react";
import type { Semester } from "@/types/grading";

interface GradeProgressProps {
	semesters: Semester[];
}

interface GradeBreakdown {
	grade: string;
	count: number;
	percentage: number;
	color: string;
}

export function GradeProgress({ semesters }: GradeProgressProps) {
	const breakdown = useMemo<GradeBreakdown[]>(() => {
		const allSubjects = semesters.flatMap((s) => s.subjects || []);

		const gradeGroups = {
			"A/A+": 0,
			"B/B+": 0,
			"C/C+": 0,
			"D & Below": 0,
		};

		for (const subject of allSubjects) {
			const grade = subject.letter_grade || "";
			if (grade.startsWith("A")) gradeGroups["A/A+"]++;
			else if (grade.startsWith("B")) gradeGroups["B/B+"]++;
			else if (grade.startsWith("C")) gradeGroups["C/C+"]++;
			else if (grade) gradeGroups["D & Below"]++;
		}

		const total = allSubjects.length;
		const colors = {
			"A/A+": "linear-gradient(to right, #34d399, #10b981)",
			"B/B+": "linear-gradient(to right, #60a5fa, #2563eb)",
			"C/C+": "linear-gradient(to right, #fbbf24, #d97706)",
			"D & Below": "linear-gradient(to right, #f43f5e, #e11d48)",
		};

		return Object.entries(gradeGroups).map(([grade, count]) => ({
			grade,
			count,
			percentage: total > 0 ? Math.round((count / total) * 100) : 0,
			color: colors[grade as keyof typeof colors],
		}));
	}, [semesters]);

	const totalSubjects = useMemo(() => breakdown.reduce((sum, b) => sum + b.count, 0), [breakdown]);

	const topGradePercentage = breakdown[0]?.percentage || 0;

	const mostFrequentGrade = useMemo(() => {
		if (totalSubjects === 0) return null;
		const sorted = [...breakdown].sort((a, b) => b.count - a.count);
		return sorted[0];
	}, [breakdown, totalSubjects]);

	const passingPercentage = useMemo(() => {
		if (totalSubjects === 0) return 0;
		const passingCount = breakdown
			.filter((b) => b.grade !== "D & Below")
			.reduce((sum, b) => sum + b.count, 0);
		return Math.round((passingCount / totalSubjects) * 100);
	}, [breakdown, totalSubjects]);

	return (
		<div className="card-skeuo flex h-full flex-col justify-between rounded-[32px] p-6">
			<div>
				<div className="mb-4 flex items-start justify-between">
					<div>
						<h3 className="text-lg font-semibold text-slate-800">Grade Distribution</h3>
						{totalSubjects > 0 && (
							<div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-emerald-50/80 px-2.5 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1.5px_3px_rgba(0,0,0,0.03)]">
								<span className="text-xs font-normal text-emerald-600">
									{topGradePercentage}% A's
								</span>
							</div>
						)}
					</div>
					<div className="icon-skeuo-raised flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200/80 text-slate-400/90 shadow-[inset_0_1px_0_#ffffff,0_2px_4px_rgba(0,0,0,0.02)]">
						<Award className="h-4.5 w-4.5" />
					</div>
				</div>

				{/* Big Number */}
				<div className="mb-3.5 flex items-end gap-3">
					<span className="text-4xl leading-none font-light tracking-tight text-slate-800">
						{totalSubjects}
					</span>
					<div className="mb-1">
						<span className="text-sm font-normal text-slate-400">subjects</span>
					</div>
				</div>

				{/* Progress Bars or Empty State */}
				{totalSubjects === 0 ? (
					<div className="py-8 text-center text-sm font-normal text-slate-400">
						No subjects added yet
					</div>
				) : (
					<div className="space-y-3">
						{breakdown.map((item) => (
							<div key={item.grade}>
								<div className="mb-1.5 flex items-center justify-between">
									<span className="text-sm font-normal text-slate-500">{item.grade}</span>
									<span className="text-sm font-normal text-slate-700">{item.count}</span>
								</div>
								<div className="h-3 overflow-hidden rounded-full border border-slate-200/20 bg-slate-100/90 p-[1px] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.8)]">
									<div
										className="h-full rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(0,0,0,0.12)] transition-all duration-500"
										style={{
											width: `${item.percentage}%`,
											backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 5px), ${item.color}`,
										}}
									/>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Bottom Insight Footer */}
			{totalSubjects > 0 && (
				<div className="mt-auto flex items-center justify-between border-t border-slate-100/90 pt-2.5 text-xs font-normal text-slate-400">
					<div className="flex items-center gap-1">
						<span>Most frequent:</span>
						<span className="font-semibold text-slate-600">{mostFrequentGrade?.grade}</span>
					</div>
					<div className="flex items-center gap-1">
						<span>Passing rate:</span>
						<span className="font-semibold text-emerald-600">{passingPercentage}%</span>
					</div>
				</div>
			)}
		</div>
	);
}
