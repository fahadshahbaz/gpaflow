"use client";

import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteSubject } from "@/lib/supabase/mutations";

interface DeleteSubjectDialogProps {
	subjectId: string;
	subjectName: string;
	semesterId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteSubjectDialog({
	subjectId,
	subjectName,
	semesterId,
	open,
	onOpenChange,
}: DeleteSubjectDialogProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleDelete() {
		setLoading(true);
		setError(null);

		try {
			await deleteSubject(subjectId, semesterId);
			onOpenChange(false);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Failed to delete subject");
		} finally {
			setLoading(false);
		}
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="rounded-2xl border-gray-200 bg-white">
				<AlertDialogHeader className="space-y-1">
					<AlertDialogTitle className="text-lg font-semibold text-gray-900">
						Delete Subject
					</AlertDialogTitle>
					<AlertDialogDescription className="text-sm text-gray-500">
						This action cannot be undone
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="py-3">
					<p className="text-sm text-gray-600">
						Are you sure you want to delete{" "}
						<span className="font-medium text-gray-900">{subjectName}</span>? This will permanently
						remove this subject and recalculate your semester GPA.
					</p>

					{error && (
						<div className="text-destructive animate-in fade-in slide-in-from-top-1 mt-3 text-sm duration-150">
							{error}
						</div>
					)}
				</div>

				<AlertDialogFooter className="gap-2">
					<AlertDialogCancel
						disabled={loading}
						className="h-9 rounded-xl border-gray-200 bg-white px-4 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
					>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={loading}
						className="bg-destructive hover:bg-destructive-600 text-destructive-foreground h-9 rounded-xl px-4 font-medium disabled:opacity-50"
					>
						{loading ? (
							<span className="flex items-center gap-2">
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
								Deleting...
							</span>
						) : (
							"Delete Subject"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
