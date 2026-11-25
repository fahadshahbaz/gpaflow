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
	const university = (user.user_metadata?.university as UniversitySlug) || "numl";

	return (
		<div className="mx-auto max-w-400 px-4 py-8 sm:px-6">
			{/* Page Header */}
			<div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
				<div>
					<h1 className="text-3xl font-light text-gray-900">
						<span className="font-medium">Semesters</span>
					</h1>
					<p className="mt-1 text-gray-500">Manage your academic records and subjects</p>
				</div>
				<AddSemesterDialog semesterCount={semesters.length} />
			</div>

			{/* Semester List */}
			<div className="rounded-3xl border border-slate-200/60 bg-[#f8fafc] p-4 shadow-[inset_0_1.5px_3.5px_rgba(0,0,0,0.04)] sm:p-6">
				<div className="mb-6">
					<h2 className="text-lg font-semibold text-gray-900">Academic Records</h2>
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
