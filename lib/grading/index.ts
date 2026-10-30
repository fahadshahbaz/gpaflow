import type { GradingEngine, UniversitySlug } from "@/types/grading";
import * as gcufEngine from "./gcuf";
import * as gcwufEngine from "./gcwuf";
import * as numlEngine from "./numl";

/**
 * Get the grading engine for a specific university
 */
export function getUniversityGradingEngine(
	university: UniversitySlug,
): GradingEngine {
	switch (university) {
		case "gcwuf":
			return {
				calculateGradePoint: gcwufEngine.calculateGradePoint,
				getLetterGrade: gcwufEngine.getLetterGrade,
				calculateSGPA: gcwufEngine.calculateSGPA,
				calculateCGPA: gcwufEngine.calculateCGPA,
			};
		case "gcuf_arts":
			return gcufEngine.artsEngine;
		case "gcuf_eng":
			return gcufEngine.engEngine;
		default:
			return {
				calculateGradePoint: (
					marks: number,
					_creditHours?: number,
					totalMarks?: number,
				) => {
					const percentage =
						totalMarks && totalMarks > 0 ? (marks / totalMarks) * 100 : marks;
					return numlEngine.calculateGradePoint(percentage);
				},
				getLetterGrade: (
					marks: number,
					_creditHours?: number,
					totalMarks?: number,
				) => {
					const percentage =
						totalMarks && totalMarks > 0 ? (marks / totalMarks) * 100 : marks;
					return numlEngine.getLetterGrade(percentage);
				},
				calculateSGPA: numlEngine.calculateSGPA,
				calculateCGPA: numlEngine.calculateCGPA,
			};
	}
}

// Re-export individual engines for direct access if needed
export { gcwufEngine as gcwuf, numlEngine as numl, gcufEngine as gcuf };
