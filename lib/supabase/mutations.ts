"use server";

import { revalidatePath } from "next/cache";
import { getUniversityGradingEngine } from "@/lib/grading";
import { createClient } from "@/lib/supabase/server";
import { subjectSchema } from "@/lib/validations/subject";
import type { UniversitySlug } from "@/types/grading";
import { getUser } from "./auth";

export async function createSemester(name: string) {
	const user = await getUser();
	if (!user) throw new Error("Unauthorized");

	const supabase = await createClient();

	// Get the next semester number
	const { data: lastSemester } = await supabase
		.from("semesters")
		.select("semester_number")
		.eq("user_id", user.id)
		.order("semester_number", { ascending: false })
		.limit(1)
		.single();

	const nextNumber = (lastSemester?.semester_number ?? 0) + 1;

	const { error } = await supabase.from("semesters").insert({
		user_id: user.id,
		name,
		semester_number: nextNumber,
		year: new Date().getFullYear(),
	});

	if (error) throw error;

	revalidatePath("/dashboard");
}

export async function deleteSemester(id: string) {
	const user = await getUser();
	if (!user) throw new Error("Unauthorized");

	const supabase = await createClient();

	const { error } = await supabase.from("semesters").delete().eq("id", id).eq("user_id", user.id);

	if (error) throw error;

	revalidatePath("/dashboard");
}

export async function updateSemester(id: string, name: string) {
	const user = await getUser();
	if (!user) throw new Error("Unauthorized");

	const supabase = await createClient();

	const { error } = await supabase
		.from("semesters")
		.update({ name })
		.eq("id", id)
		.eq("user_id", user.id);

	if (error) throw error;

	revalidatePath("/dashboard");
}

export type SubjectInput = {
	name: string;
	obtained_marks: number;
	total_marks?: number;
	credit_hours: number;
};

export async function createSubject(semesterId: string, data: SubjectInput) {
	const user = await getUser();
	if (!user) throw new Error("Unauthorized");

	// Validate input
	const result = subjectSchema.safeParse(data);
	if (!result.success) {
		throw new Error(result.error.issues[0].message);
	}

	const supabase = await createClient();

	// Verify the semester belongs to the user
	const { data: semester, error: semesterError } = await supabase
		.from("semesters")
		.select("id")
		.eq("id", semesterId)
		.eq("user_id", user.id)
		.single();

	if (semesterError || !semester) {
		throw new Error("Semester not found");
	}

	const university = (user.user_metadata?.university as UniversitySlug) || "numl";
	const engine = getUniversityGradingEngine(university);

	const { error } = await supabase.from("subjects").insert({
		semester_id: semesterId,
		name: result.data.name,
		obtained_marks: result.data.obtained_marks,
		total_marks: result.data.total_marks,
		credit_hours: result.data.credit_hours,
		grade_point: engine.calculateGradePoint(
			result.data.obtained_marks,
			result.data.credit_hours,
			result.data.total_marks,
		),
		letter_grade: String(
			engine.getLetterGrade(
				result.data.obtained_marks,
				result.data.credit_hours,
				result.data.total_marks,
			),
		),
	});

	if (error) {
		console.error("Create subject error:", JSON.stringify(error, null, 2));
		throw new Error(error.message || "Failed to create subject");
	}

	revalidatePath("/dashboard");
}

export async function updateSubject(
	subjectId: string,
	semesterId: string,
	data: Partial<SubjectInput>,
) {
	const user = await getUser();
	if (!user) throw new Error("Unauthorized");

	const supabase = await createClient();

	// Verify the semester belongs to the user
	const { data: semester, error: semesterError } = await supabase
		.from("semesters")
		.select("id")
		.eq("id", semesterId)
		.eq("user_id", user.id)
		.single();

	if (semesterError || !semester) {
		throw new Error("Unauthorized");
	}

	// Build update object with only provided fields
	const updateData: Record<string, string | number | undefined> = {};
	if (data.name !== undefined) updateData.name = data.name;

	if (data.obtained_marks !== undefined) {
		updateData.obtained_marks = data.obtained_marks;
	}
	if (data.total_marks !== undefined) {
		updateData.total_marks = data.total_marks;
	}
	if (data.credit_hours !== undefined) {
		updateData.credit_hours = data.credit_hours;
	}

	// Recalculate grades if any grade-affecting fields are updated
	if (
		data.obtained_marks !== undefined ||
		data.credit_hours !== undefined ||
		data.total_marks !== undefined
	) {
		const { data: existingSubject, error: fetchError } = await supabase
			.from("subjects")
			.select("obtained_marks, credit_hours, total_marks")
			.eq("id", subjectId)
			.eq("semester_id", semesterId)
			.single();

		if (fetchError || !existingSubject) {
			throw new Error("Subject not found");
		}

		const finalObtainedMarks =
			data.obtained_marks !== undefined ? data.obtained_marks : existingSubject.obtained_marks;
		const finalCreditHours =
			data.credit_hours !== undefined ? data.credit_hours : existingSubject.credit_hours;
		const finalTotalMarks =
			data.total_marks !== undefined
				? data.total_marks
				: (existingSubject.total_marks ?? undefined);

		const university = (user.user_metadata?.university as UniversitySlug) || "numl";
		const engine = getUniversityGradingEngine(university);

		updateData.grade_point = engine.calculateGradePoint(
			finalObtainedMarks,
			finalCreditHours,
			finalTotalMarks,
		);
		updateData.letter_grade = String(
			engine.getLetterGrade(finalObtainedMarks, finalCreditHours, finalTotalMarks),
		);
	}

	const { error } = await supabase
		.from("subjects")
		.update(updateData)
		.eq("id", subjectId)
		.eq("semester_id", semesterId);

	if (error) throw error;

	revalidatePath("/dashboard");
}

export async function deleteSubject(subjectId: string, semesterId: string) {
	const user = await getUser();
	if (!user) throw new Error("Unauthorized");

	const supabase = await createClient();

	// Verify the semester belongs to the user
	const { data: semester, error: semesterError } = await supabase
		.from("semesters")
		.select("id")
		.eq("id", semesterId)
		.eq("user_id", user.id)
		.single();

	if (semesterError || !semester) {
		throw new Error("Unauthorized");
	}

	const { error } = await supabase
		.from("subjects")
		.delete()
		.eq("id", subjectId)
		.eq("semester_id", semesterId);

	if (error) throw error;

	revalidatePath("/dashboard");
}
