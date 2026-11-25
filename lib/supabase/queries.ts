"use server";

import { cache } from "react";
import { getUniversityGradingEngine } from "@/lib/grading";
import { getUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type {
	DashboardStats,
	Semester,
	Subject,
	SubjectInput,
	UniversitySlug,
} from "@/types/grading";

async function getUserUniversity(): Promise<UniversitySlug> {
	const user = await getUser();
	const university = user?.user_metadata?.university;

	if (
		university === "gcwuf" ||
		university === "numl" ||
		university === "gcuf_arts" ||
		university === "gcuf_eng"
	) {
		return university;
	}

	return "numl"; // Default fallback
}

export const getSemesters = cache(async (userId: string): Promise<Semester[]> => {
	const [supabase, university] = await Promise.all([createClient(), getUserUniversity()]);
	const engine = getUniversityGradingEngine(university);

	const { data: semesters, error } = await supabase
		.from("semesters")
		.select(`
			id,
			name,
			semester_number,
			year,
			subjects (
				id,
				name,
				obtained_marks,
				total_marks,
				credit_hours
			)
		`)
		.eq("user_id", userId)
		.order("semester_number", { ascending: true });

	if (error || !semesters) {
		console.error("Error fetching semesters:", error);
		return [];
	}

	type RawSemester = {
		id: string;
		name: string;
		semester_number: number;
		year: number;
		subjects: SubjectInput[] | null;
	};

	return (semesters as RawSemester[]).map((semester): Semester => {
		const rawSubjects = (semester.subjects || []) as SubjectInput[];

		const subjectsWithGrades: Subject[] = rawSubjects.map((subject): Subject => ({
			...subject,
			grade_point: engine.calculateGradePoint(
				subject.obtained_marks,
				subject.credit_hours,
				subject.total_marks,
			),
			letter_grade: String(
				engine.getLetterGrade(subject.obtained_marks, subject.credit_hours, subject.total_marks),
			),
		}));

		const sgpa = engine.calculateSGPA(subjectsWithGrades);

		const totalCreditHours = subjectsWithGrades.reduce((sum, s) => sum + s.credit_hours, 0);

		return {
			id: semester.id,
			name: semester.name,
			semester_number: semester.semester_number,
			year: semester.year,
			sgpa,
			total_credit_hours: totalCreditHours,
			subjects: subjectsWithGrades,
		};
	});
});

export async function getDashboardStats(userId: string, targetGpa = 3.5): Promise<DashboardStats> {
	const [semesters, university] = await Promise.all([getSemesters(userId), getUserUniversity()]);
	const engine = getUniversityGradingEngine(university);

	const cgpa = engine.calculateCGPA(
		semesters.map((s) => ({
			sgpa: s.sgpa,
			totalCreditHours: s.total_credit_hours,
		})),
	);

	const totalCreditHours = semesters.reduce((sum, s) => sum + s.total_credit_hours, 0);

	return {
		cgpa,
		totalCreditHours,
		semesterCount: semesters.length,
		targetGpa,
	};
}
