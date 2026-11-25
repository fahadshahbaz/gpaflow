export type UniversitySlug = "numl" | "gcwuf" | "gcuf_arts" | "gcuf_eng";

export interface University {
	id: string;
	name: string;
	slug: UniversitySlug;
	fullName: string;
	description: string;
}

export const UNIVERSITIES: Record<UniversitySlug, University> = {
	numl: {
		id: "numl",
		name: "NUML",
		slug: "numl",
		fullName: "National University of Modern Languages",
		description: "Letter grade system with 4.0 GPA scale",
	},
	gcwuf: {
		id: "gcwuf",
		name: "GCWUF",
		slug: "gcwuf",
		fullName: "GC University for Women Faisalabad",
		description: "Quality points table system",
	},
	gcuf_arts: {
		id: "gcuf_arts",
		name: "GCUF (Arts / General)",
		slug: "gcuf_arts",
		fullName: "GC University Faisalabad",
		description: "Undergrad general / arts. Decimal marks round UP.",
	},
	gcuf_eng: {
		id: "gcuf_eng",
		name: "GCUF (Engineering)",
		slug: "gcuf_eng",
		fullName: "GC University Faisalabad",
		description: "Undergrad engineering. Pass >= 55% only.",
	},
};

export type LetterGrade =
	| "A+"
	| "A"
	| "A-"
	| "B+"
	| "B"
	| "B-"
	| "C+"
	| "C"
	| "C-"
	| "D+"
	| "D"
	| "F";

export interface GradeResult {
	letterGrade: LetterGrade;
	gradePoint: number;
	percentage: number;
}

export interface SubjectInput {
	id: string;
	name: string;
	obtained_marks: number;
	total_marks?: number; // Only for GCWUF, NUML always uses 100
	credit_hours: number;
}

export interface Subject extends SubjectInput {
	grade_point: number;
	letter_grade: string;
}

export interface SemesterInput {
	id: string;
	name: string;
	semester_number: number;
	year: number;
	subjects: SubjectInput[];
}

export interface Semester {
	id: string;
	name: string;
	semester_number: number;
	year: number;
	sgpa: number;
	total_credit_hours: number;
	subjects: Subject[];
}

export interface GradingEngine {
	calculateGradePoint(marks: number, creditHours: number, totalMarks?: number): number;
	getLetterGrade(marks: number, creditHours: number, totalMarks?: number): LetterGrade | string;
	calculateSGPA(
		subjects: Array<{
			obtained_marks: number;
			total_marks?: number;
			credit_hours: number;
			grade_point?: number;
		}>,
	): number;
	calculateCGPA(semesters: Array<{ sgpa: number; totalCreditHours: number }>): number;
}

export interface DashboardStats {
	cgpa: number;
	totalCreditHours: number;
	semesterCount: number;
	targetGpa: number;
}

export interface UserProfile {
	id: string;
	university: UniversitySlug;
	cgpa: number;
	totalCreditHours: number;
	targetGpa: number;
	createdAt: string;
	updatedAt: string;
}
