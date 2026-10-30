import type { GradeResult, LetterGrade } from "@/types/grading";

const CREDIT_HOUR_CAPS: Record<number, number> = {
	5: 100,
	4: 80,
	3: 60,
	2: 40,
	1: 20,
};

// Official GCWUF Quality Points Lookup Table
const QUALITY_POINTS_TABLE: Record<number, Record<number, number>> = {
	// 5 Credit Hours (Max 100)
	5: {
		40: 5.0,
		41: 5.5,
		42: 6.0,
		43: 6.5,
		44: 7.0,
		45: 7.5,
		46: 8.0,
		47: 8.5,
		48: 9.0,
		49: 9.5,
		50: 10.0,
		51: 10.5,
		52: 10.5,
		53: 11.0,
		54: 11.5,
		55: 11.5,
		56: 12.0,
		57: 12.5,
		58: 12.5,
		59: 13.0,
		60: 13.5,
		61: 13.5,
		62: 14.0,
		63: 14.5,
		64: 14.5,
		65: 15.0,
		66: 15.5,
		67: 15.5,
		68: 16.0,
		69: 16.5,
		70: 16.5,
		71: 17.0,
		72: 17.5,
		73: 17.5,
		74: 18.0,
		75: 18.5,
		76: 19.0,
		77: 19.0,
		78: 19.5,
		79: 19.5,
		80: 20.0, // Marks >= 80 give max 20 QP
	},
	// 4 Credit Hours (Max 80)
	4: {
		32: 4.0,
		33: 4.4,
		34: 5.2,
		35: 5.6,
		36: 6.0,
		37: 6.4,
		38: 7.2,
		39: 7.6,
		40: 8.0,
		41: 8.4,
		42: 8.8,
		43: 8.8,
		44: 9.2,
		45: 9.6,
		46: 10.0,
		47: 10.4,
		48: 10.8,
		49: 10.8,
		50: 11.2,
		51: 11.6,
		52: 12.0,
		53: 12.0,
		54: 12.4,
		55: 12.8,
		56: 13.2,
		57: 13.6,
		58: 14.0,
		59: 14.4,
		60: 14.8,
		61: 14.8,
		62: 15.2,
		63: 15.6,
		64: 16.0, // Marks >= 64 give max 16 QP
	},
	// 3 Credit Hours (Max 60)
	3: {
		24: 3.0,
		25: 3.6,
		26: 3.9,
		27: 4.5,
		28: 5.1,
		29: 5.4,
		30: 6.0,
		31: 6.3,
		32: 6.6,
		33: 6.9,
		34: 7.2,
		35: 7.5,
		36: 8.1,
		37: 8.4,
		38: 8.7,
		39: 9.0,
		40: 9.3,
		41: 9.6,
		42: 9.9,
		43: 10.2,
		44: 10.5,
		45: 11.1,
		46: 11.4,
		47: 11.7,
		48: 12.0, // Marks >= 48 give max 12 QP
	},
	// 2 Credit Hours (Max 40)
	2: {
		16: 2.0,
		17: 2.6,
		18: 3.0,
		19: 3.6,
		20: 4.0,
		21: 4.4,
		22: 4.6,
		23: 5.0,
		24: 5.4,
		25: 5.6,
		26: 6.0,
		27: 6.4,
		28: 6.6,
		29: 7.0,
		30: 7.4,
		31: 7.6,
		32: 8.0, // Marks >= 32 give max 8 QP
	},
	// 1 Credit Hour (Max 20)
	1: {
		8: 1.0,
		9: 1.5,
		10: 2.0,
		11: 2.3,
		12: 2.7,
		13: 3.0,
		14: 3.3,
		15: 3.7,
		16: 4.0, // Marks >= 16 give max 4 QP
	},
};

export function getQualityPoints(
	obtainedMarks: number,
	creditHours: number,
	totalMarks: number,
): number {
	if (totalMarks <= 0) return 0;

	// Determine standard max marks for the credit hour
	const expectedMax = CREDIT_HOUR_CAPS[creditHours] || creditHours * 20;

	// Normalize marks to the standard scale if necessary
	let normalizedMarks: number;
	if (Math.abs(totalMarks - expectedMax) < 0.1) {
		normalizedMarks = obtainedMarks;
	} else {
		normalizedMarks = (obtainedMarks / totalMarks) * expectedMax;
	}

	// Round to nearest whole number for table lookup
	const lookupKey = Math.round(normalizedMarks);

	const table = QUALITY_POINTS_TABLE[creditHours];
	if (!table) return 0;

	// Handle marks exceeding the capped maximum in the table
	const keys = Object.keys(table)
		.map(Number)
		.sort((a, b) => a - b);
	const maxKey = keys[keys.length - 1];

	if (lookupKey >= maxKey) {
		return table[maxKey];
	}

	return table[lookupKey] || 0;
}

export function getLetterGrade(
	obtainedMarks: number,
	creditHours: number,
	totalMarks?: number,
): LetterGrade {
	const total = totalMarks ?? creditHours * 20;
	if (total === 0) return "F";

	const percentage = (obtainedMarks / total) * 100;

	// Standard GCWUF Grading Policy
	if (percentage >= 80) return "A";
	if (percentage >= 65) return "B";
	if (percentage >= 50) return "C";
	if (percentage >= 40) return "D";
	return "F";
}

export function calculateGradePoint(
	obtainedMarks: number,
	creditHours: number,
	totalMarks?: number,
): number {
	const total = totalMarks ?? creditHours * 20;
	const qp = getQualityPoints(obtainedMarks, creditHours, total);

	if (creditHours === 0) return 0;

	return Math.round((qp / creditHours) * 100) / 100;
}

export function getGradeResult(
	obtainedMarks: number,
	creditHours: number,
	totalMarks?: number,
): GradeResult {
	const total = totalMarks ?? creditHours * 20;
	const percentage = Math.round((obtainedMarks / total) * 100 * 100) / 100;

	return {
		letterGrade: getLetterGrade(obtainedMarks, creditHours, total),
		gradePoint: calculateGradePoint(obtainedMarks, creditHours, total),
		percentage,
	};
}

export function calculateSGPA(
	subjects: Array<{
		obtained_marks: number;
		credit_hours: number;
		total_marks?: number;
	}>,
): number {
	if (subjects.length === 0) return 0;

	let totalQualityPoints = 0;
	let totalCreditHours = 0;

	for (const s of subjects) {
		const total = s.total_marks ?? s.credit_hours * 20;
		const qp = getQualityPoints(s.obtained_marks, s.credit_hours, total);

		totalQualityPoints += qp;
		totalCreditHours += s.credit_hours;
	}

	if (totalCreditHours === 0) return 0;
	return Math.round((totalQualityPoints / totalCreditHours) * 100) / 100;
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
