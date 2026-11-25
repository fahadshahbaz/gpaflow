"use client";

import { BookOpen } from "lucide-react";
import { useMemo } from "react";
import type { Semester } from "@/types/grading";

interface ActivityDotsProps {
	semesters: Semester[];
}

export function ActivityDots({ semesters }: ActivityDotsProps) {
	const activity = useMemo(() => {
		const semesterData = semesters.map((s, i) => ({
			name: `S${i + 1}`,
			fullName: s.name,
			subjects: s.subjects?.length || 0,
		}));

		const total = semesterData.reduce((sum, s) => sum + s.subjects, 0);
		const avgPerSemester = semesters.length > 0 ? total / semesters.length : 0;

		return {
			semesters: semesterData,
			total,
			avgPerSemester: Number(avgPerSemester.toFixed(1)),
		};
	}, [semesters]);

	const maxSubjects = useMemo(
		() => Math.max(...activity.semesters.map((s) => s.subjects), 1),
		[activity.semesters],
	);

	const getDotStyles = (semesterIndex: number, dotIndex: number, totalDots: number) => {
		const isActive = dotIndex < totalDots;
		if (!isActive) {
			return "bg-slate-100 border border-slate-200/50 shadow-[inset_0_1.5px_2.5px_rgba(0,0,0,0.05),0_1px_0_#ffffff] hover:scale-105";
		}

		const intensity = (semesterIndex + 1) / activity.semesters.length;
		let gradientClass =
			"from-emerald-400 to-emerald-600 border border-emerald-600/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1.5px_3px_rgba(16,185,129,0.25)]";

		if (intensity > 0.8) {
			gradientClass =
				"from-emerald-400 to-emerald-600 border border-emerald-600/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(16,185,129,0.3)]";
		} else if (intensity > 0.6) {
			gradientClass =
				"from-emerald-400 to-emerald-500 border border-emerald-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1.5px_3px_rgba(16,185,129,0.25)]";
		} else if (intensity > 0.4) {
			gradientClass =
				"from-emerald-400/80 to-emerald-500/90 border border-emerald-500/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_1.5px_2.5px_rgba(16,185,129,0.2)]";
		} else if (intensity > 0.2) {
			gradientClass =
				"from-emerald-300/85 to-emerald-400 border border-emerald-400/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(16,185,129,0.15)]";
		} else {
			gradientClass =
				"from-emerald-300/50 to-emerald-400/60 border border-emerald-300/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0.5px_1.5px_rgba(16,185,129,0.1)]";
		}

		return `bg-gradient-to-br hover:scale-125 hover:shadow-[0_0_8px_rgba(16,185,129,0.5)] ${gradientClass}`;
	};

	return (
		<div className="card-skeuo flex h-full flex-col rounded-[32px] p-6">
			<div className="mb-4 flex items-start justify-between">
				<div>
					<h3 className="text-lg font-semibold text-slate-800">Subjects</h3>
					<p className="text-sm font-normal text-slate-500">Semester-wise subject breakdown</p>
				</div>
				<div className="icon-skeuo-raised flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200/80 text-slate-400/90 shadow-[inset_0_1px_0_#ffffff,0_2px_4px_rgba(0,0,0,0.02)]">
					<BookOpen className="h-4.5 w-4.5" />
				</div>
			</div>

			{/* Big Number */}
			<div className="mb-3.5 flex items-end gap-4">
				<span className="text-4xl leading-none font-light tracking-tight text-slate-800">
					{activity.total}
				</span>
				<div className="mb-1">
					<span className="text-sm font-normal text-slate-400">total subjects</span>
				</div>
				<div className="mb-1 ml-auto text-right">
					<p className="text-xs leading-tight font-normal text-slate-400">avg per semester</p>
					<p className="mt-0.5 text-sm leading-tight font-normal text-emerald-600">
						{activity.avgPerSemester}
					</p>
				</div>
			</div>

			{/* Semester Grid or Empty State */}
			{activity.semesters.length === 0 ? (
				<div className="my-auto py-8 text-center text-sm font-normal text-slate-400">
					No semesters added yet
				</div>
			) : (
				<div className="my-2 space-y-2">
					{activity.semesters.map((semester, semesterIndex) => (
						<div key={semester.name} className="flex items-center gap-3 py-1">
							<span className="w-6 flex-shrink-0 text-xs font-normal text-slate-500">
								{semester.name}
							</span>
							<div className="flex flex-1 gap-1.5">
								{Array.from({ length: maxSubjects }, (_, dotIndex) => (
									<div
										key={dotIndex}
										className={`h-3 w-3 rounded-full transition-[transform,box-shadow] duration-200 ease-out ${getDotStyles(semesterIndex, dotIndex, semester.subjects)}`}
										title={dotIndex < semester.subjects ? `Subject ${dotIndex + 1}` : ""}
									/>
								))}
							</div>
							<span className="w-4 text-right text-xs font-normal text-slate-700">
								{semester.subjects}
							</span>
						</div>
					))}
				</div>
			)}

			{/* Legend */}
			{activity.semesters.length > 0 && (
				<div className="mt-auto flex items-center justify-between border-t border-slate-100/90 pt-2.5">
					<div className="flex items-center gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full border border-emerald-500/10 bg-emerald-500/20" />
						<div className="h-2.5 w-2.5 rounded-full border border-emerald-500/10 bg-emerald-500/60" />
						<div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
						<span className="ml-1 text-xs font-normal text-slate-400">Recent semesters</span>
					</div>
					<div className="flex items-center gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full border border-slate-200/50 bg-slate-100 shadow-[inset_0_1px_1.5px_rgba(0,0,0,0.05)]" />
						<span className="text-xs font-normal text-slate-400">Empty</span>
					</div>
				</div>
			)}
		</div>
	);
}
