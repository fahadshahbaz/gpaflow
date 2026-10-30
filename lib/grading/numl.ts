import type { GradeResult, LetterGrade } from "@/types/grading";

export function roundMarks(marks: number): number {
	return Math.round(marks);
}

export function calculateGradePoint(rawMarks: number): number {
	const marks = roundMarks(rawMarks);

	if (marks >= 80) return 4.0;
	if (marks >= 75) return Math.round((3.5 + (marks - 75) * 0.1) * 100) / 100;
	if (marks >= 70) return Math.round((3.0 + (marks - 70) * 0.1) * 100) / 100;
	if (marks >= 65) return Math.round((2.5 + (marks - 65) * 0.1) * 100) / 100;
	if (marks >= 60) return Math.round((2.0 + (marks - 60) * 0.1) * 100) / 100;
	if (marks >= 55) return Math.round((1.5 + (marks - 55) * 0.1) * 100) / 100;
	if (marks >= 50) return Math.round((1.0 + (marks - 50) * 0.1) * 100) / 100;
	return 0.0;
}

// Round to 2 decimal places for display
export function formatGradePoint(gp: number): number {
	return Math.round(gp * 100) / 100;
}

export function getLetterGrade(rawMarks: number): LetterGrade {
	const marks = roundMarks(rawMarks);

	if (marks >= 90) return "A+";
	if (marks >= 80) return "A";
	if (marks >= 75) return "B+";
	if (marks >= 70) return "B";
	if (marks >= 65) return "C+";
	if (marks >= 60) return "C";
	if (marks >= 55) return "D+";
	if (marks >= 50) return "D";
	return "F";
}

export function getGradeResult(
	obtainedMarks: number,
	totalMarks = 100,
): GradeResult {
	const percentage = (obtainedMarks / totalMarks) * 100;

	return {
		letterGrade: getLetterGrade(percentage),
		gradePoint: calculateGradePoint(percentage),
		percentage: Math.round(percentage * 100) / 100,
	};
}

export function calculateSGPA(
	subjects: Array<{
		grade_point?: number;
		obtained_marks?: number;
		credit_hours: number;
	}>,
): number {
	if (subjects.length === 0) return 0;

	const totalWeightedPoints = subjects.reduce((sum, s) => {
		const gp =
			s.grade_point !== undefined
				? s.grade_point
				: s.obtained_marks !== undefined
					? calculateGradePoint(s.obtained_marks)
					: 0;
		return sum + gp * s.credit_hours;
	}, 0);
	const totalCreditHours = subjects.reduce((sum, s) => sum + s.credit_hours, 0);

	if (totalCreditHours === 0) return 0;
	return Math.round((totalWeightedPoints / totalCreditHours) * 100) / 100;
}

export function calculateCGPA(
	semesters: Array<{ sgpa: number; totalCreditHours: number }>,
): number {
	if (semesters.length === 0) return 0;

	const totalWeightedPoints = semesters.reduce(
		(sum, s) => sum + s.sgpa * s.totalCreditHours,
		0,
	);
	const totalCreditHours = semesters.reduce(
		(sum, s) => sum + s.totalCreditHours,
		0,
	);

	if (totalCreditHours === 0) return 0;
	return Math.round((totalWeightedPoints / totalCreditHours) * 100) / 100;
}

export function calculateRequiredSGPA(
	currentCGPA: number,
	currentCredits: number,
	targetCGPA: number,
	nextSemesterCredits: number,
): number | null {
	if (nextSemesterCredits <= 0) return null;

	const currentWeightedSum = currentCGPA * currentCredits;
	const totalCreditsAfter = currentCredits + nextSemesterCredits;
	const requiredSGPA =
		(targetCGPA * totalCreditsAfter - currentWeightedSum) / nextSemesterCredits;

	if (requiredSGPA > 4.0) return null;
	if (requiredSGPA < 0) return 0;
	return Math.round(requiredSGPA * 100) / 100;
}
