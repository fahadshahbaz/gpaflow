"use client";

import { Plus } from "lucide-react";

import { useState } from "react";
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
import { createSemester } from "@/lib/supabase/mutations";

const MAX_SEMESTERS = 8;

export function AddSemesterDialog({ semesterCount = 0 }: { semesterCount?: number }) {
	const isMaxReached = semesterCount >= MAX_SEMESTERS;
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;

		setLoading(true);
		setError(null);

		try {
			await createSemester(name);
			setOpen(false);
			setName("");
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Failed to create semester");
		} finally {
			setLoading(false);
		}
	}

	if (isMaxReached) {
		return (
			<Button
				disabled
				className="flex h-9 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-100 px-4 text-xs font-extrabold text-slate-400 opacity-50"
				title="Maximum of 8 semesters reached"
			>
				<Plus className="mr-1.5 h-4 w-4" />
				New Semester
			</Button>
		);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="skeuoPrimary"
					className="flex h-9 cursor-pointer items-center justify-center rounded-xl px-4 text-xs font-extrabold"
				>
					<Plus className="mr-1.5 h-4 w-4" />
					New Semester
				</Button>
			</DialogTrigger>
			<DialogContent className="rounded-2xl border-gray-200 bg-white shadow-xl sm:max-w-105">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-gray-900">Create Semester</DialogTitle>
					<DialogDescription className="text-sm text-gray-500">
						Add a new semester to track your academic progress
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 pt-2">
					<Field>
						<FieldLabel className="mb-2 block text-sm font-medium text-gray-600">
							Semester Name
						</FieldLabel>
						<Input
							placeholder="e.g. Semester 1, Fall 2024"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.06)] transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
							disabled={loading}
						/>
						{error && (
							<div className="animate-in fade-in slide-in-from-top-1 duration-150">
								<FieldError className="text-destructive mt-2 text-sm">{error}</FieldError>
							</div>
						)}
					</Field>
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
							disabled={loading || !name.trim()}
							className="h-10 cursor-pointer rounded-xl px-5 text-xs font-extrabold disabled:opacity-50"
						>
							{loading ? (
								<span className="flex items-center gap-2">
									<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
									Creating...
								</span>
							) : (
								"Create Semester"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
