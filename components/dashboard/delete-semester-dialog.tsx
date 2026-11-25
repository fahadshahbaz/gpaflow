"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { deleteSemester } from "@/lib/supabase/mutations";

interface DeleteSemesterDialogProps {
	semesterId: string;
	semesterName: string;
	subjectCount: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteSemesterDialog({
	semesterId,
	semesterName,
	subjectCount,
	open,
	onOpenChange,
}: DeleteSemesterDialogProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleDelete() {
		setLoading(true);
		setError(null);

		try {
			await deleteSemester(semesterId);
			onOpenChange(false);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Failed to delete semester");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-2xl border-gray-200 bg-white sm:max-w-[425px]">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className="bg-destructive-50 border-destructive-100 flex h-10 w-10 items-center justify-center rounded-xl border">
							<AlertTriangle className="text-destructive h-5 w-5" />
						</div>
						<div>
							<DialogTitle className="text-xl font-semibold text-gray-900">
								Delete Semester
							</DialogTitle>
						</div>
					</div>
					<DialogDescription className="pt-4 text-sm text-gray-500">
						Are you sure you want to delete{" "}
						<span className="font-medium text-gray-900">{semesterName}</span>?
						{subjectCount > 0 && (
							<span className="text-destructive mt-2 block text-xs">
								This will also delete {subjectCount} subject
								{subjectCount > 1 ? "s" : ""} associated with this semester.
							</span>
						)}
					</DialogDescription>
				</DialogHeader>
				{error && (
					<p className="text-destructive bg-destructive-50 border-destructive-100 rounded-lg border px-3 py-2 text-sm">
						{error}
					</p>
				)}
				<DialogFooter className="gap-3 pt-2">
					<Button
						type="button"
						variant="ghost"
						onClick={() => onOpenChange(false)}
						disabled={loading}
						className="rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900"
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleDelete}
						disabled={loading}
						className="bg-destructive hover:bg-destructive-600 text-destructive-foreground h-11 rounded-xl px-6 font-medium transition-all disabled:opacity-50"
					>
						<Trash2 className="mr-2 h-4 w-4" />
						{loading ? "Deleting..." : "Delete"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
