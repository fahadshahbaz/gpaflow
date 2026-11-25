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
	const percentageToTarget = targetGpa > 0 ? Math.min((cgpa / targetGpa) * 100, 100) : 0;

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
				<div className="card-skeuo flex h-full flex-col justify-between rounded-[32px] p-6">
					<div>
						<div className="mb-3 flex items-center justify-between">
							<h3 className="text-sm font-normal text-slate-500">Cumulative GPA</h3>
							<div className="icon-skeuo-raised flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200/80 text-slate-400/90 shadow-[inset_0_1px_0_#ffffff,0_2px_4px_rgba(0,0,0,0.02)]">
								<GraduationCap className="h-4.5 w-4.5" />
							</div>
						</div>
						<div className="mb-3.5 flex items-end gap-3">
							<span className="text-5xl leading-none font-light tracking-tight text-slate-800">
								{cgpa.toFixed(2)}
							</span>
							{gpaChange !== null && !isMaxReached && (
								<div
									className={`mb-0.5 flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1.5px_3px_rgba(0,0,0,0.03)] sm:px-2.5 sm:py-1 sm:text-xs ${
										gpaChange >= 0
											? "border-emerald-200/50 bg-emerald-50/80 text-emerald-600"
											: "border-rose-200/50 bg-rose-50/80 text-rose-600"
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
					<div className="mt-auto space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="font-normal text-slate-500">Progress to Target</span>
							<span className="font-normal text-slate-800">{targetGpa.toFixed(2)}</span>
						</div>
						<div className="h-3 overflow-hidden rounded-full border border-slate-200/20 bg-slate-100/90 p-[1px] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.8)]">
							<div
								className="from-primary to-primary-600 h-full rounded-full bg-gradient-to-r shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(0,0,0,0.15)] transition-[width] duration-300 ease-out"
								style={{ width: `${percentageToTarget}%` }}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Credit Hours */}
			<div className="col-span-6 md:col-span-6 lg:col-span-2">
				<div className="card-skeuo flex h-full flex-col justify-between rounded-[32px] p-6">
					<div>
						<div className="mb-3 flex items-center justify-between">
							<h3 className="text-sm font-normal text-slate-500">Total Credits</h3>
							<div className="icon-skeuo-raised flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200/80 text-slate-400/90 shadow-[inset_0_1px_0_#ffffff,0_2px_4px_rgba(0,0,0,0.02)]">
								<Award className="h-4.5 w-4.5" />
							</div>
						</div>
						<span className="text-4xl leading-none font-light tracking-tight text-slate-800">
							{totalCreditHours}
						</span>
					</div>
					<p className="mt-1.5 text-sm font-normal text-slate-400">credit hours</p>
				</div>
			</div>

			{/* Semesters */}
			<div className="col-span-6 md:col-span-6 lg:col-span-2">
				<div className="card-skeuo flex h-full flex-col justify-between rounded-[32px] p-6">
					<div>
						<div className="mb-3 flex items-center justify-between">
							<h3 className="text-sm font-normal text-slate-500">Semesters</h3>
							<div className="icon-skeuo-raised flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200/80 text-slate-400/90 shadow-[inset_0_1px_0_#ffffff,0_2px_4px_rgba(0,0,0,0.02)]">
								<Calendar className="h-4.5 w-4.5" />
							</div>
						</div>
						<div className="flex items-end gap-2">
							<span className="text-4xl leading-none font-light tracking-tight text-slate-800">
								{semesterCount}
							</span>
							<span className="mb-1 text-lg leading-none font-normal text-slate-400">/ 8</span>
						</div>
					</div>
					{/* 8-segment hardware LED indicator bar */}
					<div className="mt-3 flex gap-1">
						{Array.from({ length: 8 }, (_, i) => {
							const isLit = i < semesterCount;
							return (
								<div
									key={i}
									className={`h-3 flex-1 rounded-sm border transition-[background-color,box-shadow,border-color] duration-300 ease-out ${
										isLit
											? "border-emerald-500/20 bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1.5px_3px_rgba(16,185,129,0.3)]"
											: "border-slate-200/50 bg-slate-100/95 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,0.7)]"
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
				<div className="card-skeuo flex h-full flex-col justify-between rounded-[32px] p-6">
					<div className="mb-3 flex items-center justify-between">
						<h3 className="text-sm font-normal text-slate-500">Target GPA</h3>
						<div className="flex items-center gap-2">
							{semesterCount > 0 && !isEditing && (
								<span
									className={`rounded-full border px-1.5 py-0.5 text-[10px] font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1.5px_3px_rgba(0,0,0,0.03)] sm:px-2.5 sm:py-1 sm:text-xs ${
										isTargetMet
											? "border-emerald-200/50 bg-emerald-50/80 text-emerald-600"
											: isMaxReached
												? "border-slate-200/80 bg-slate-100 text-slate-600"
												: "border-amber-200/50 bg-amber-50/80 text-amber-600"
									}`}
								>
									{isTargetMet ? "Achieved" : isMaxReached ? "Completed" : "In Progress"}
								</span>
							)}
							{!isEditing && (
								<button
									type="button"
									onClick={() => setIsEditing(true)}
									className="icon-skeuo-raised flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 text-slate-500 shadow-[inset_0_1px_0_#ffffff,0_2px_4px_rgba(0,0,0,0.04)] transition-all hover:scale-[1.03] hover:text-slate-700 active:scale-[0.97]"
									aria-label="Edit target GPA"
									title="Edit target GPA"
								>
									<Pencil className="h-4 w-4" />
								</button>
							)}
						</div>
					</div>

					{isEditing ? (
						<div className="mt-auto space-y-3">
							<div className="flex items-center gap-2">
								<input
									type="number"
									step="0.01"
									min="0"
									max="4"
									value={editValue}
									onChange={(e) => setEditValue(e.target.value)}
									className="focus:ring-primary/20 w-full rounded-2xl border border-slate-200/80 bg-[#f8fafc] px-4 py-2.5 text-4xl font-light tracking-tight text-slate-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.06),0_1px_0_#ffffff] focus:ring-2 focus:outline-none"
									disabled={isPending}
								/>
							</div>
							{error && <p className="text-xs font-normal text-rose-600">{error}</p>}
							<div className="flex gap-2">
								<button
									type="button"
									onClick={handleSave}
									disabled={isPending}
									className="from-primary to-primary-600 hover:from-primary-500 hover:to-primary-650 border-primary/45 flex flex-1 items-center justify-center gap-2 rounded-xl border bg-gradient-to-b px-4 py-2.5 text-sm font-normal text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_6px_rgba(15,23,42,0.08)] transition-all active:scale-[0.98]"
								>
									<Check className="h-4 w-4" />
									{isPending ? "Saving..." : "Save"}
								</button>
								<button
									type="button"
									onClick={handleCancel}
									disabled={isPending}
									className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 py-2.5 text-sm font-normal text-slate-700 shadow-[inset_0_1px_0_#ffffff,0_2px_4px_rgba(0,0,0,0.03)] transition-all hover:bg-slate-50 active:scale-[0.98]"
								>
									<X className="h-4 w-4" />
									Cancel
								</button>
							</div>
						</div>
					) : (
						<div className="mt-auto">
							<span className="text-5xl leading-none font-light tracking-tight text-slate-800">
								{targetGpa.toFixed(2)}
							</span>
							<div className="mt-4 flex items-center gap-4">
								{semesterCount > 0 && (
									<p className="text-sm font-normal text-slate-500">
										{isTargetMet ? (
											<span className="font-normal text-emerald-600">Target achieved</span>
										) : isMaxReached ? (
											<span className="font-normal text-slate-500">
												Degree completed · Final CGPA {cgpa.toFixed(2)}
											</span>
										) : (
											<>
												<span className="text-primary font-normal">
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
