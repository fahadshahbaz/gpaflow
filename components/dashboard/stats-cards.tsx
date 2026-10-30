"use client";

import {
	Award,
	Calendar,
	Check,
	GraduationCap,
	Pencil,
	TrendingDown,
	TrendingUp,
	X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { updateTargetGpa } from "@/lib/supabase/auth";
import type { Semester } from "@/types/grading";

interface StatsCardsProps {
	cgpa: number;
	totalCreditHours: number;
	semesterCount: number;
	targetGpa: number;
	semesters: Semester[];
}

export function StatsCards({
	cgpa,
	totalCreditHours,
	semesterCount,
	targetGpa,
	semesters,
}: StatsCardsProps) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(targetGpa.toString());
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	const isMaxReached = semesterCount >= 8;

	// Calculate actual GPA change from last two semesters
	const gpaChange = useMemo(() => {
		if (semesters.length < 2) return null;
		const lastSGPA = semesters[semesters.length - 1].sgpa;
		const prevSGPA = semesters[semesters.length - 2].sgpa;
		return lastSGPA - prevSGPA;
	}, [semesters]);

	const isTargetMet = cgpa >= targetGpa;
	const percentageToTarget =
		targetGpa > 0 ? Math.min((cgpa / targetGpa) * 100, 100) : 0;

	const handleSave = useCallback(() => {
		const value = Number.parseFloat(editValue);

		if (Number.isNaN(value) || value < 0 || value > 4) {
			setError("Enter a valid GPA (0-4)");
			return;
		}

		setError(null);
		startTransition(async () => {
			const result = await updateTargetGpa(value);
			if (result.error) {
				setError(result.error);
			} else {
				setIsEditing(false);
				router.refresh();
			}
		});
	}, [editValue, router]);

	const handleCancel = useCallback(() => {
		setIsEditing(false);
		setEditValue(targetGpa.toString());
		setError(null);
	}, [targetGpa]);

	return (
		<>
			{/* CGPA Card - Large Featured */}
			<div className="col-span-12 md:col-span-6 lg:col-span-4">
				<div className="card-skeuo rounded-[32px] p-6 h-full flex flex-col justify-between">
					<div>
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-sm font-normal text-slate-500">
								Cumulative GPA
							</h3>
							<div className="icon-skeuo-raised h-9 w-9 rounded-xl border border-slate-200/80 shadow-[inset_0_1px_0_#ffffff,0_2px_4px_rgba(0,0,0,0.02)] text-slate-400/90 flex items-center justify-center flex-shrink-0">
								<GraduationCap className="h-4.5 w-4.5" />
							</div>
						</div>
						<div className="flex items-end gap-3 mb-3.5">
							<span className="text-5xl font-light text-slate-800 tracking-tight leading-none">
								{cgpa.toFixed(2)}
							</span>
							{gpaChange !== null && (
								<div
									className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-normal border shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1.5px_3px_rgba(0,0,0,0.03)] mb-0.5 ${
										gpaChange >= 0
											? "bg-emerald-50/80 border-emerald-200/50 text-emerald-600"
											: "bg-rose-50/80 border-rose-200/50 text-rose-600"
									}`}
								>
									{gpaChange >= 0 ? (
										<TrendingUp className="h-3.5 w-3.5" />
									) : (
										<TrendingDown className="h-3.5 w-3.5" />
									)}
									{gpaChange >= 0 ? "+" : ""}
									{gpaChange.toFixed(2)}
								</div>
							)}
						</div>
					</div>

					{/* Progress to target */}
					<div className="space-y-2 mt-auto">
						<div className="flex items-center justify-between text-sm">
							<span className="text-slate-500 font-normal">
								Progress to Target
							</span>
							<span className="font-normal text-slate-800">
								{targetGpa.toFixed(2)}
							</span>
						</div>
						<div className="h-3 bg-slate-100/90 rounded-full shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.8)] border border-slate-200/20 p-[1px] overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-primary to-primary-600 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(0,0,0,0.15)] transition-[width] duration-300 ease-out"
								style={{ width: `${percentageToTarget}%` }}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Credit Hours */}
			<div className="col-span-6 md:col-span-6 lg:col-span-2">
				<div className="card-skeuo rounded-[32px] p-6 h-full flex flex-col justify-between">
					<div>
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-sm font-normal text-slate-500">
								Total Credits
							</h3>
							<div className="icon-skeuo-raised h-9 w-9 rounded-xl border border-slate-200/80 shadow-[inset_0_1px_0_#ffffff,0_2px_4px_rgba(0,0,0,0.02)] text-slate-400/90 flex items-center justify-center flex-shrink-0">
								<Award className="h-4.5 w-4.5" />
							</div>
						</div>
						<span className="text-4xl font-light text-slate-800 tracking-tight leading-none">
							{totalCreditHours}
						</span>
					</div>
					<p className="text-sm text-slate-400 font-normal mt-1.5">
						credit hours
					</p>
				</div>
			</div>

			{/* Semesters */}
			<div className="col-span-6 md:col-span-6 lg:col-span-2">
				<div className="card-skeuo rounded-[32px] p-6 h-full flex flex-col justify-between">
					<div>
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-sm font-normal text-slate-500">Semesters</h3>
							<div className="icon-skeuo-raised h-9 w-9 rounded-xl border border-slate-200/80 shadow-[inset_0_1px_0_#ffffff,0_2px_4px_rgba(0,0,0,0.02)] text-slate-400/90 flex items-center justify-center flex-shrink-0">
								<Calendar className="h-4.5 w-4.5" />
							</div>
						</div>
						<div className="flex items-end gap-2">
							<span className="text-4xl font-light text-slate-800 tracking-tight leading-none">
								{semesterCount}
							</span>
							<span className="text-lg text-slate-400 font-normal leading-none mb-1">
								/ 8
							</span>
						</div>
					</div>
					{/* 8-segment hardware LED indicator bar */}
					<div className="flex gap-1 mt-3">
						{Array.from({ length: 8 }, (_, i) => {
							const isLit = i < semesterCount;
							return (
								<div
									key={i}
									className={`h-3 flex-1 rounded-sm border transition-[background-color,box-shadow,border-color] duration-300 ease-out ${
										isLit
											? "bg-gradient-to-br from-emerald-400 to-emerald-500 border-emerald-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1.5px_3px_rgba(16,185,129,0.3)]"
											: "bg-slate-100/95 border-slate-200/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,0.7)]"
									}`}
									title={`Semester ${i + 1}`}
								/>
							);
						})}
					</div>
				</div>
			</div>

			{/* Target GPA - Editable */}
			<div className="col-span-12 md:col-span-6 lg:col-span-4">
				<div className="card-skeuo rounded-[32px] p-6 h-full flex flex-col justify-between">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-sm font-normal text-slate-500">Target GPA</h3>
						<div className="flex items-center gap-2">
							{semesterCount > 0 && !isEditing && (
								<span
									className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-normal border shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1.5px_3px_rgba(0,0,0,0.03)] ${
										isTargetMet
											? "bg-emerald-50/80 border-emerald-200/50 text-emerald-600"
											: isMaxReached
												? "bg-slate-100 border-slate-200/80 text-slate-600"
												: "bg-amber-50/80 border-amber-200/50 text-amber-600"
									}`}
								>
									{isTargetMet
										? "Achieved"
										: isMaxReached
											? "Completed"
											: "In Progress"}
								</span>
							)}
							{!isEditing && (
								<button
									type="button"
									onClick={() => setIsEditing(true)}
									disabled={isMaxReached}
									className={`icon-skeuo-raised h-8 w-8 rounded-full border border-slate-200/80 shadow-[inset_0_1px_0_#ffffff,0_2px_4px_rgba(0,0,0,0.04)] flex items-center justify-center transition-all ${
										isMaxReached
											? "opacity-40 text-slate-400 pointer-events-none"
											: "hover:scale-[1.03] active:scale-[0.97] text-slate-500 hover:text-slate-700"
									}`}
									aria-label={
										isMaxReached ? "Degree completed" : "Edit target GPA"
									}
									title={isMaxReached ? "Degree completed" : "Edit target GPA"}
								>
									<Pencil className="h-4 w-4" />
								</button>
							)}
						</div>
					</div>

					{isEditing ? (
						<div className="space-y-3 mt-auto">
							<div className="flex items-center gap-2">
								<input
									type="number"
									step="0.01"
									min="0"
									max="4"
									value={editValue}
									onChange={(e) => setEditValue(e.target.value)}
									className="w-full text-4xl font-light text-slate-800 tracking-tight bg-[#f8fafc] border border-slate-200/80 shadow-[inset_0_2px_5px_rgba(0,0,0,0.06),0_1px_0_#ffffff] rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
									disabled={isPending}
								/>
							</div>
							{error && (
								<p className="text-xs text-rose-600 font-normal">{error}</p>
							)}
							<div className="flex gap-2">
								<button
									type="button"
									onClick={handleSave}
									disabled={isPending}
									className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-b from-primary to-primary-600 hover:from-primary-500 hover:to-primary-650 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_6px_rgba(15,23,42,0.08)] border border-primary/45 rounded-xl text-sm font-normal active:scale-[0.98] transition-all"
								>
									<Check className="h-4 w-4" />
									{isPending ? "Saving..." : "Save"}
								</button>
								<button
									type="button"
									onClick={handleCancel}
									disabled={isPending}
									className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-b from-white to-slate-50 border border-slate-200 text-slate-700 shadow-[inset_0_1px_0_#ffffff,0_2px_4px_rgba(0,0,0,0.03)] rounded-xl text-sm font-normal active:scale-[0.98] transition-all hover:bg-slate-50"
								>
									<X className="h-4 w-4" />
									Cancel
								</button>
							</div>
						</div>
					) : (
						<div className="mt-auto">
							<span className="text-5xl font-light text-slate-800 tracking-tight leading-none">
								{targetGpa.toFixed(2)}
							</span>
							<div className="mt-4 flex items-center gap-4">
								{semesterCount > 0 && (
									<p className="text-sm text-slate-500 font-normal">
										{isTargetMet ? (
											<span className="text-emerald-600 font-normal">
												Target achieved
											</span>
										) : isMaxReached ? (
											<span className="text-slate-500 font-normal">
												Degree completed · Final CGPA {cgpa.toFixed(2)}
											</span>
										) : (
											<>
												<span className="font-normal text-primary">
													{(targetGpa - cgpa).toFixed(2)}
												</span>{" "}
												points needed
											</>
										)}
									</p>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
