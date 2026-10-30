import type { LetterGrade } from "@/types/grading";

// Official GCUF Percentage to Grade Point (GP) Mapping (from Table 20.6.2)
export const GCUF_GP_MAP: Record<number, number> = {
	40: 1.0,
	41: 1.1,
	42: 1.2,
	43: 1.3,
	44: 1.4,
	45: 1.5,
	46: 1.6,
	47: 1.7,
	48: 1.8,
	49: 1.9,
	50: 2.0,
	51: 2.07,
	52: 2.14,
	53: 2.21,
	54: 2.28,
	55: 2.35,
	56: 2.42,
	57: 2.49,
	58: 2.56,
	59: 2.63,
	60: 2.7,
	61: 2.76,
	62: 2.82,
	63: 2.88,
	64: 2.94,
	65: 3.0,
	66: 3.05,
	67: 3.1,
	68: 3.15,
	69: 3.2,
	70: 3.25,
	71: 3.3,
	72: 3.35,
	73: 3.4,
	74: 3.45,
	75: 3.5,
	76: 3.55,
	77: 3.6,
	78: 3.65,
	79: 3.7,
	80: 3.75,
	81: 3.8,
	82: 3.85,
	83: 3.9,
	84: 3.95,
};

/**
 * Calculates percentage and rounds UP to the next whole number.
 * "Fraction in obtained percentage marks of a course will be rounded to the next whole number"
 */
export function getRoundedPercentage(
	obtainedMarks: number,
	totalMarks = 100,
): number {
	if (totalMarks <= 0) return 0;
	const rawPercentage = (obtainedMarks / totalMarks) * 100;
	return Math.ceil(rawPercentage);
}

// -------------------------------------------------------------
// GCUF - General/Arts Undergraduate Grading Strategy
// -------------------------------------------------------------

export function calculateArtsGradePoint(
	obtainedMarks: number,
	_creditHours: number,
	totalMarks = 100,
): number {
	const percentage = getRoundedPercentage(obtainedMarks, totalMarks);

	if (percentage < 40) return 0.0;
	if (percentage >= 85) return 4.0;

	return GCUF_GP_MAP[percentage] || 0.0;
}

export function getArtsLetterGrade(
	obtainedMarks: number,
	_creditHours: number,
	totalMarks = 100,
): LetterGrade {
	const percentage = getRoundedPercentage(obtainedMarks, totalMarks);

	if (percentage >= 85) return "A";
	if (percentage >= 80) return "A-";
	if (percentage >= 70) return "B+";
	if (percentage >= 65) return "B";
	if (percentage >= 60) return "B-";
	if (percentage >= 55) return "C+";
	if (percentage >= 50) return "C";
	if (percentage >= 45) return "C-";
	if (percentage >= 40) return "D";
	return "F";
}

export function calculateArtsSGPA(
	subjects: Array<{
		obtained_marks: number;
		total_marks?: number;
		credit_hours: number;
		grade_point?: number;
	}>,
): number {
	if (subjects.length === 0) return 0;

	let totalQualityPoints = 0;
	let totalCreditHours = 0;

	for (const s of subjects) {
		const total = s.total_marks ?? 100;
		const gp =
			s.grade_point !== undefined
				? s.grade_point
				: calculateArtsGradePoint(s.obtained_marks, s.credit_hours, total);

		totalQualityPoints += gp * s.credit_hours;
		totalCreditHours += s.credit_hours;
	}

	if (totalCreditHours === 0) return 0;
	return Math.round((totalQualityPoints / totalCreditHours) * 100) / 100;
}

// -------------------------------------------------------------
// GCUF - Engineering Undergraduate Grading Strategy
// -------------------------------------------------------------

export function calculateEngGradePoint(
	obtainedMarks: number,
	_creditHours: number,
	totalMarks = 100,
): number {
	const percentage = getRoundedPercentage(obtainedMarks, totalMarks);

	// No C-, C, D grades in EE -> Must be >= 55 to pass
	if (percentage < 55) return 0.0;
	if (percentage >= 85) return 4.0;

	return GCUF_GP_MAP[percentage] || 0.0;
}

export function getEngLetterGrade(
	obtainedMarks: number,
	_creditHours: number,
	totalMarks = 100,
): LetterGrade {
	const percentage = getRoundedPercentage(obtainedMarks, totalMarks);

	if (percentage >= 85) return "A";
	if (percentage >= 80) return "A-";
	if (percentage >= 70) return "B+";
	if (percentage >= 65) return "B";
	if (percentage >= 60) return "B-";
	if (percentage >= 55) return "C+";
	// No C-, C, D grades in EE -> Less than 55 is F
	return "F";
}

export function calculateEngSGPA(
	subjects: Array<{
		obtained_marks: number;
		total_marks?: number;
		credit_hours: number;
		grade_point?: number;
	}>,
): number {
	if (subjects.length === 0) return 0;

	let totalQualityPoints = 0;
	let totalCreditHours = 0;

	for (const s of subjects) {
		const total = s.total_marks ?? 100;
		const gp =
			s.grade_point !== undefined
				? s.grade_point
				: calculateEngGradePoint(s.obtained_marks, s.credit_hours, total);

		totalQualityPoints += gp * s.credit_hours;
		totalCreditHours += s.credit_hours;
	}

	if (totalCreditHours === 0) return 0;
	return Math.round((totalQualityPoints / totalCreditHours) * 100) / 100;
}

// -------------------------------------------------------------
// Shared Calculations
// -------------------------------------------------------------

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

// -------------------------------------------------------------
// Engine Implementations
// -------------------------------------------------------------

export const artsEngine = {
	calculateGradePoint: calculateArtsGradePoint,
	getLetterGrade: getArtsLetterGrade,
	calculateSGPA: calculateArtsSGPA,
	calculateCGPA,
};

export const engEngine = {
	calculateGradePoint: calculateEngGradePoint,
	getLetterGrade: getEngLetterGrade,
	calculateSGPA: calculateEngSGPA,
	calculateCGPA,
};
