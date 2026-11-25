"use client";

import {
	BookOpen,
	ChevronDown,
	ChevronRight,
	MoreVertical,
	Pencil,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUniversityGradingEngine } from "@/lib/grading";
import type { Semester, Subject, UniversitySlug } from "@/types/grading";
import { AddSubjectDialog } from "./add-subject-dialog";
import { DeleteSemesterDialog } from "./delete-semester-dialog";
import { DeleteSubjectDialog } from "./delete-subject-dialog";
import { EditSemesterDialog } from "./edit-semester-dialog";
import { EditSubjectDialog } from "./edit-subject-dialog";

interface SemesterListProps {
	semesters: Semester[];
	university: UniversitySlug;
}

export function SemesterList({ semesters, university }: SemesterListProps) {
	const _engine = getUniversityGradingEngine(university);
	const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
	const [deletingSemester, setDeletingSemester] = useState<Semester | null>(null);
	const [editingSubject, setEditingSubject] = useState<{
		subject: Subject;
		semesterId: string;
	} | null>(null);
	const [deletingSubject, setDeletingSubject] = useState<{
		subject: Subject;
		semesterId: string;
	} | null>(null);
	const [activeSemesterId, setActiveSemesterId] = useState<string | null>(null);

	const toggleExpanded = (semesterId: string) => {
		setActiveSemesterId((prev) => (prev === semesterId ? null : semesterId));
	};

	if (semesters.length === 0) {
		return (
			<div className="py-16 text-center">
				<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
					<BookOpen className="h-7 w-7 text-gray-400" />
				</div>
				<h3 className="mb-1 text-lg font-medium text-gray-900">No semesters yet</h3>
				<p className="mx-auto max-w-xs text-sm text-gray-500">
					Start tracking your academic journey by adding your first semester
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-3">
				{semesters.map((semester, index) => {
					const isCurrentExpanded = activeSemesterId === semester.id;

					return (
						<div
							key={semester.id}
							className="t-acc card-skeuo mb-3 overflow-hidden rounded-2xl"
							data-open={isCurrentExpanded}
						>
							{/* Accordion Trigger Header */}
							<div
								onClick={() => toggleExpanded(semester.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										toggleExpanded(semester.id);
									}
								}}
								role="button"
								tabIndex={0}
								className="flex cursor-pointer items-center justify-between p-3 select-none sm:p-4"
							>
								<div className="flex items-center gap-2 sm:gap-3">
									{/* Tactile Inset Number Circle */}
									<div className="icon-skeuo-inset flex h-9 w-9 items-center justify-center rounded-xl">
										<span className="text-xs font-bold text-gray-500">{index + 1}</span>
									</div>
									<div>
										<h4 className="text-xs font-bold whitespace-nowrap text-gray-900 sm:text-sm">
											{semester.name}
										</h4>
										<p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
											{semester.year}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-1.5 sm:gap-3">
									{/* Tactile Badges */}
									<span className="icon-skeuo-raised rounded-lg px-1.5 py-0.5 text-[10px] font-bold text-blue-600 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs">
										{semester.sgpa.toFixed(2)} SGPA
									</span>
									<span className="icon-skeuo-inset hidden rounded-xl px-2.5 py-1.5 text-xs font-medium text-gray-500 sm:inline">
										{semester.total_credit_hours} Credits
									</span>

									{/* Options Dropdown */}
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<button
												type="button"
												className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:bg-slate-200/50"
												aria-label="More options"
												onClick={(e) => e.stopPropagation()}
											>
												<MoreVertical className="h-4 w-4" />
											</button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="z-50 min-w-[140px] rounded-xl border-gray-200 bg-white shadow-lg"
										>
											<DropdownMenuItem
												onClick={(e) => {
													e.stopPropagation();
													setEditingSemester(semester);
												}}
												className="cursor-pointer rounded-lg text-sm"
											>
												<Pencil className="mr-2 h-4 w-4 text-gray-400" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												variant="destructive"
												onClick={(e) => {
													e.stopPropagation();
													setDeletingSemester(semester);
												}}
												className="cursor-pointer rounded-lg text-sm"
											>
												<Trash2 className="mr-2 h-4 w-4" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>

									{/* Expand/Collapse Chevron Indicator */}
									<ChevronDown className="t-acc-chevron h-4.5 w-4.5 text-gray-400" />
								</div>
							</div>

							{/* Collapsible Panel Body */}
							<div className="t-acc-panel">
								<div className="t-acc-panel-inner space-y-2.5 border-t border-slate-100/90 bg-slate-50/20 p-4">
									{semester.subjects.length === 0 ? (
										<div className="border-slate-150 rounded-xl border bg-white py-8 text-center shadow-[0_2px_8px_rgba(15,23,42,0.01)]">
											<p className="mb-3 text-sm text-gray-500">
												No subjects added to this semester yet
											</p>
											<AddSubjectDialog
												semesterId={semester.id}
												semesterName={semester.name}
												university={university}
												trigger={
													<Button
														variant="ghost"
														size="sm"
														className="text-primary hover:text-primary-700 hover:bg-primary-50 h-8 text-xs font-bold"
													>
														Add subject
														<ChevronRight className="ml-1 h-3.5 w-3.5" />
													</Button>
												}
											/>
										</div>
									) : (
										<div className="space-y-2">
											{semester.subjects.map((subject) => (
												<div
													key={subject.id}
													className="group/subject flex items-center justify-between rounded-xl border border-slate-200/50 bg-slate-50/50 px-4 py-3 text-sm shadow-[inset_0_1px_0_#ffffff] transition-colors hover:bg-slate-50"
												>
													<span className="flex-1 truncate font-semibold text-gray-700">
														{subject.name}
													</span>
													<div className="flex items-center gap-3">
														<span className="icon-skeuo-raised text-blue-650 rounded-lg px-2.5 py-1 text-xs font-extrabold">
															{subject.letter_grade}
														</span>
														<span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
															{subject.credit_hours} CH
														</span>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<button
																	type="button"
																	className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-gray-400 opacity-0 transition-opacity group-hover/subject:opacity-100 hover:bg-gray-200"
																	aria-label="Subject options"
																	onClick={(e) => e.stopPropagation()}
																>
																	<MoreVertical className="h-3.5 w-3.5" />
																</button>
															</DropdownMenuTrigger>
															<DropdownMenuContent
																align="end"
																className="z-50 min-w-[110px] rounded-xl border-gray-200 bg-white shadow-lg"
															>
																<DropdownMenuItem
																	onClick={(e) => {
																		e.stopPropagation();
																		setEditingSubject({
																			subject,
																			semesterId: semester.id,
																		});
																	}}
																	className="cursor-pointer rounded-lg text-xs"
																>
																	<Pencil className="mr-2 h-3.5 w-3.5 text-gray-400" />
																	Edit
																</DropdownMenuItem>
																<DropdownMenuItem
																	variant="destructive"
																	onClick={(e) => {
																		e.stopPropagation();
																		setDeletingSubject({
																			subject,
																			semesterId: semester.id,
																		});
																	}}
																	className="cursor-pointer rounded-lg text-xs"
																>
																	<Trash2 className="mr-2 h-3.5 w-3.5" />
																	Delete
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
												</div>
											))}

											<AddSubjectDialog
												semesterId={semester.id}
												semesterName={semester.name}
												university={university}
												trigger={
													<button
														type="button"
														className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-xl border border-dashed border-slate-200 py-2.5 text-xs font-bold text-slate-500 transition-colors duration-200 ease-out hover:border-blue-400/50 hover:bg-blue-50/20 hover:text-blue-600"
													>
														<Plus className="h-3.5 w-3.5" />
														Add Subject
													</button>
												}
											/>
										</div>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Semester Dialogs */}
			{editingSemester ? (
				<EditSemesterDialog
					semesterId={editingSemester.id}
					currentName={editingSemester.name}
					open={!!editingSemester}
					onOpenChange={(open) => !open && setEditingSemester(null)}
				/>
			) : null}

			{deletingSemester ? (
				<DeleteSemesterDialog
					semesterId={deletingSemester.id}
					semesterName={deletingSemester.name}
					subjectCount={deletingSemester.subjects.length}
					open={!!deletingSemester}
					onOpenChange={(open) => !open && setDeletingSemester(null)}
				/>
			) : null}

			{/* Subject Dialogs */}
			{editingSubject ? (
				<EditSubjectDialog
					subject={editingSubject.subject}
					semesterId={editingSubject.semesterId}
					university={university}
					open={!!editingSubject}
					onOpenChange={(open) => !open && setEditingSubject(null)}
				/>
			) : null}

			{deletingSubject ? (
				<DeleteSubjectDialog
					subjectId={deletingSubject.subject.id}
					subjectName={deletingSubject.subject.name}
					semesterId={deletingSubject.semesterId}
					open={!!deletingSubject}
					onOpenChange={(open) => !open && setDeletingSubject(null)}
				/>
			) : null}
		</>
	);
}
