import { redirect } from "next/navigation";
import { AddSemesterDialog } from "@/components/dashboard/add-semester-dialog";
import { SemesterList } from "@/components/dashboard/semester-list";
import { getUser } from "@/lib/supabase/auth";
import { getSemesters } from "@/lib/supabase/queries";
import type { UniversitySlug } from "@/types/grading";

export default async function SemestersPage() {
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	const semesters = await getSemesters(user.id);
	const university =
		(user.user_metadata?.university as UniversitySlug) || "numl";

	return (
		<div className="max-w-400 mx-auto px-4 sm:px-6 py-8">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
				<div>
					<h1 className="text-3xl font-light text-gray-900">
						<span className="font-medium">Semesters</span>
					</h1>
					<p className="text-gray-500 mt-1">
						Manage your academic records and subjects
					</p>
				</div>
				<AddSemesterDialog semesterCount={semesters.length} />
			</div>

			{/* Semester List */}
			<div className="rounded-3xl bg-[#f8fafc] border border-slate-200/60 shadow-[inset_0_1.5px_3.5px_rgba(0,0,0,0.04)] p-4 sm:p-6">
				<div className="mb-6">
					<h2 className="text-lg font-semibold text-gray-900">
						Academic Records
					</h2>
					<p className="text-sm text-gray-500">
						{semesters.length === 0
							? "No semesters added yet. Add your first semester to get started."
							: `${semesters.length} semester${semesters.length > 1 ? "s" : ""} • Your semester-wise performance`}
					</p>
				</div>
				<SemesterList semesters={semesters} university={university} />
			</div>
		</div>
	);
}
