"use client";

import { Pencil } from "lucide-react";

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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateSemester } from "@/lib/supabase/mutations";

interface EditSemesterDialogProps {
	semesterId: string;
	currentName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditSemesterDialog({
	semesterId,
	currentName,
	open,
	onOpenChange,
}: EditSemesterDialogProps) {
	const [name, setName] = useState(currentName);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim() || name === currentName) {
			onOpenChange(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			await updateSemester(semesterId, name);
			onOpenChange(false);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Failed to update semester");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-2xl border-gray-200 bg-white sm:max-w-106.25">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className="bg-primary-50 border-primary-100 flex h-10 w-10 items-center justify-center rounded-xl border">
							<Pencil className="text-primary h-5 w-5" />
						</div>
						<div>
							<DialogTitle className="text-xl font-semibold text-gray-900">
								Edit Semester
							</DialogTitle>
							<DialogDescription className="text-sm text-gray-500">
								Update the name of this semester.
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-5 pt-4">
					<Field>
						<FieldLabel className="mb-2 block text-sm font-medium text-gray-600">
							Semester Name
						</FieldLabel>
						<Input
							placeholder="e.g. Semester 1, Fall 2024"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="bg-secondary/50 border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-11 rounded-xl transition-colors focus:ring-2"
							disabled={loading}
						/>
						{error && (
							<div className="animate-in fade-in slide-in-from-top-1 duration-150">
								<FieldError className="text-destructive mt-2 text-sm">{error}</FieldError>
							</div>
						)}
					</Field>
					<DialogFooter className="gap-3">
						<Button
							type="button"
							variant="skeuoWhite"
							onClick={() => onOpenChange(false)}
							disabled={loading}
							className="h-11 cursor-pointer rounded-xl px-5 text-xs font-bold"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="skeuoPrimary"
							disabled={loading || !name.trim() || name === currentName}
							className="h-11 cursor-pointer rounded-xl px-6 text-xs font-extrabold disabled:opacity-50"
						>
							{loading ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
