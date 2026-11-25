import { z } from "zod";

export const subjectSchema = z.object({
	name: z.string().min(1, "Subject name is required").max(100, "Subject name is too long"),
	obtained_marks: z.number().min(0, "Marks cannot be negative").max(100, "Marks cannot exceed 100"),
	total_marks: z.number().min(1).optional(),
	credit_hours: z
		.number()
		.min(1, "Credit hours must be at least 1")
		.max(6, "Credit hours cannot exceed 6"),
});

export type SubjectFormData = z.infer<typeof subjectSchema>;
