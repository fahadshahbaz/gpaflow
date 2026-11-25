"use client";

import { Plus } from "lucide-react";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getUniversityGradingEngine } from "@/lib/grading";
import { createSubject } from "@/lib/supabase/mutations";
import type { UniversitySlug } from "@/types/grading";

interface AddSubjectDialogProps {
	semesterId: string;
	semesterName: string;
	university: UniversitySlug;
	trigger?: React.ReactNode;
}

export function AddSubjectDialog({
	semesterId,
	semesterName,
	university,
	trigger,
}: AddSubjectDialogProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [marks, setMarks] = useState("");
	const [totalMarks, setTotalMarks] = useState("100");
	const [creditHours, setCreditHours] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const engine = getUniversityGradingEngine(university);
	const showTotalMarks = ["gcwuf", "gcuf_arts", "gcuf_eng"].includes(university);
	const maxCredits = university === "numl" ? 4 : university === "gcwuf" ? 5 : 6;

	const gradePreview = useMemo(() => {
		const marksNum = Number.parseFloat(marks);
		const totalMarksNum = Number.parseFloat(totalMarks);
		const creditHoursNum = Number.parseInt(creditHours, 10) || 3;

		if (Number.isNaN(marksNum) || marksNum < 0) return null;
		if (showTotalMarks && (Number.isNaN(totalMarksNum) || totalMarksNum <= 0)) return null;
		if (marksNum > (showTotalMarks ? totalMarksNum : 100)) return null;

		const maxMarks = showTotalMarks ? totalMarksNum : 100;
		const percentage = (marksNum / maxMarks) * 100;

		return {
			letterGrade: engine.getLetterGrade(
				marksNum,
				creditHoursNum,
				showTotalMarks ? totalMarksNum : undefined,
			),
			gradePoint: engine.calculateGradePoint(
				marksNum,
				creditHoursNum,
				showTotalMarks ? totalMarksNum : undefined,
			),
			percentage: percentage.toFixed(1),
		};
	}, [marks, totalMarks, creditHours, engine, showTotalMarks]);

	function resetForm() {
		setName("");
		setMarks("");
		setTotalMarks("100");
		setCreditHours("");
		setError(null);
	}

	function handleNumericChange(value: string, setter: (val: string) => void, allowDecimal = true) {
		const filtered = allowDecimal
			? value.replace(/[^0-9.]/g, "").replace(/(\.)(?=.*\.)/g, "")
			: value.replace(/[^0-9]/g, "");
		setter(filtered);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const trimmedName = name.trim();
		const marksNum = Number.parseFloat(marks);
		const totalMarksNum = Number.parseFloat(totalMarks);
		const creditHoursNum = Number.parseInt(creditHours, 10);

		if (!trimmedName) {
			setError("Subject name is required");
			return;
		}

		const maxMarks = showTotalMarks ? totalMarksNum : 100;
		if (Number.isNaN(marksNum) || marksNum < 0 || marksNum > maxMarks) {
			setError(`Marks must be between 0 and ${maxMarks}`);
			return;
		}

		if (showTotalMarks && (Number.isNaN(totalMarksNum) || totalMarksNum <= 0)) {
			setError("Total marks must be greater than 0");
			return;
		}

		if (Number.isNaN(creditHoursNum) || creditHoursNum < 1 || creditHoursNum > maxCredits) {
			setError(`Credit hours must be between 1 and ${maxCredits}`);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			await createSubject(semesterId, {
				name: trimmedName,
				obtained_marks: marksNum,
				total_marks: showTotalMarks ? totalMarksNum : undefined,
				credit_hours: creditHoursNum,
			});
			setOpen(false);
			resetForm();
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Failed to add subject");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) resetForm();
			}}
		>
			<DialogTrigger asChild>
				{trigger || (
					<Button
						variant="ghost"
						size="sm"
						className="text-primary hover:text-primary-700 hover:bg-primary-50 h-8"
					>
						<Plus className="mr-1 h-4 w-4" />
						Add subject
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="rounded-2xl border-gray-200 bg-white shadow-xl sm:max-w-120">
				<DialogHeader className="space-y-1">
					<DialogTitle className="text-lg font-semibold text-gray-900">Add Subject</DialogTitle>
					<DialogDescription className="text-sm text-gray-500">
						Add a subject to {semesterName}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 pt-2">
					<Field>
						<FieldLabel className="mb-2 block text-sm font-medium text-gray-600">
							Subject Name
						</FieldLabel>
						<Input
							placeholder="e.g. Calculus, Programming Fundamentals"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="bg-secondary/50 border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-11 rounded-xl focus:ring-2"
							disabled={loading}
						/>
					</Field>

					<div className={`grid items-end gap-4 ${showTotalMarks ? "grid-cols-3" : "grid-cols-2"}`}>
						<Field>
							<FieldLabel className="mb-2 block text-sm font-medium text-gray-600">
								Obtained Marks
							</FieldLabel>
							<Input
								type="text"
								inputMode="decimal"
								placeholder={showTotalMarks ? "0" : "0 - 100"}
								value={marks}
								onChange={(e) => handleNumericChange(e.target.value, setMarks)}
								className="h-11 rounded-xl border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
								disabled={loading}
							/>
						</Field>

						{showTotalMarks && (
							<Field>
								<FieldLabel className="mb-2 block text-sm font-medium text-gray-600">
									Total Marks
								</FieldLabel>
								<Input
									type="text"
									inputMode="numeric"
									placeholder="100"
									value={totalMarks}
									onChange={(e) => handleNumericChange(e.target.value, setTotalMarks, false)}
									className="h-11 rounded-xl border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
									disabled={loading}
								/>
							</Field>
						)}

						<Field>
							<FieldLabel className="mb-2 block text-sm font-medium text-gray-600">
								Credit Hours
							</FieldLabel>
							<Input
								type="text"
								inputMode="numeric"
								placeholder={`1 - ${maxCredits}`}
								value={creditHours}
								onChange={(e) => handleNumericChange(e.target.value, setCreditHours, false)}
								className="h-11 rounded-xl border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
								disabled={loading}
							/>
						</Field>
					</div>

					{gradePreview && (
						<div className="bg-primary-50 border-primary-100 animate-in fade-in slide-in-from-top-2 rounded-xl border p-4 duration-200">
							<p className="text-primary mb-2 text-xs font-medium tracking-wider uppercase">
								Grade Preview
							</p>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<span className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-base font-semibold">
										{gradePreview.letterGrade}
									</span>
									<div>
										<p className="text-2xl font-bold text-gray-900">
											{gradePreview.gradePoint.toFixed(2)}
										</p>
										<p className="text-xs text-gray-500">Grade Points</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-lg font-medium text-gray-700">{gradePreview.percentage}%</p>
									<p className="text-xs text-gray-500">Percentage</p>
								</div>
							</div>
						</div>
					)}

					{error && (
						<div className="animate-in fade-in slide-in-from-top-1 duration-150">
							<FieldError className="text-destructive text-sm">{error}</FieldError>
						</div>
					)}

					<DialogFooter className="gap-2 pt-2">
						<Button
							type="button"
							variant="skeuoWhite"
							onClick={() => setOpen(false)}
							disabled={loading}
							className="h-10 cursor-pointer rounded-xl px-4 text-xs font-bold"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="skeuoPrimary"
							disabled={loading || !name.trim() || !marks || !creditHours}
							className="h-10 cursor-pointer rounded-xl px-5 text-xs font-extrabold disabled:opacity-50"
						>
							{loading ? (
								<span className="flex items-center gap-2">
									<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
									Adding...
								</span>
							) : (
								"Add Subject"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
