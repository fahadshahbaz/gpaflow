"use client";

import { ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface GradeRow {
	grade: string;
	marks: string;
	gp: string;
}

interface UniversityPolicy {
	slug: string;
	name: string;
	description: string;
	passMark: string;
	rounding: string;
	calculation: string;
	gradeTable: GradeRow[];
	isNew?: boolean;
}

const POLICIES: UniversityPolicy[] = [
	{
		slug: "numl",
		name: "National University of Modern Languages (NUML)",
		description: "Uses standard letter grades and a 4.0 GPA scale.",
		passMark: "50%",
		rounding: "Round to nearest whole number",
		calculation: "GPA goes up smoothly inside each grade range",
		gradeTable: [
			{ grade: "A+", marks: "90% and above", gp: "4.00" },
			{ grade: "A", marks: "80% to 89.99%", gp: "4.00" },
			{ grade: "B+", marks: "75% to 79.99%", gp: "3.50 - 3.99" },
			{ grade: "B", marks: "70% to 74.99%", gp: "3.00 - 3.49" },
			{ grade: "C+", marks: "65% to 69.99%", gp: "2.50 - 2.99" },
			{ grade: "C", marks: "60% to 64.99%", gp: "2.00 - 2.49" },
			{ grade: "D+", marks: "55% to 59.99%", gp: "1.50 - 1.99" },
			{ grade: "D", marks: "50% to 54.99%", gp: "1.00 - 1.49" },
			{ grade: "F", marks: "Below 50%", gp: "0.00" },
		],
	},
	{
		slug: "gcwuf",
		name: "GC University for Women Faisalabad (GCWUF)",
		description: "Uses special points lookup tables based on credit hours.",
		passMark: "40%",
		rounding: "Round to nearest whole number",
		calculation: "Looks up points from a table based on subject credit hours",
		gradeTable: [
			{
				grade: "A",
				marks: "80% and above",
				gp: "4.00 (varies by credit hours)",
			},
			{
				grade: "B",
				marks: "65% to 79%",
				gp: "3.00 - 3.80 (varies by credit hours)",
			},
			{
				grade: "C",
				marks: "50% to 64%",
				gp: "2.00 - 2.80 (varies by credit hours)",
			},
			{
				grade: "D",
				marks: "40% to 49%",
				gp: "1.00 - 1.90 (varies by credit hours)",
			},
			{ grade: "F", marks: "Below 40%", gp: "0.00" },
		],
	},
	{
		slug: "gcuf_arts",
		name: "GC University Faisalabad (General / Arts)",
		description: "For bachelor degrees in arts and general science.",
		passMark: "40%",
		rounding:
			"Ceil Round (decimals always round UP, e.g., 52.1% goes up to 53%)",
		calculation: "Looks up your grade points directly from a table",
		isNew: true,
		gradeTable: [
			{ grade: "A", marks: "85% and above", gp: "4.00" },
			{ grade: "A-", marks: "80% to 84%", gp: "3.75 - 3.95" },
			{ grade: "B+", marks: "70% to 79%", gp: "3.25 - 3.70" },
			{ grade: "B", marks: "65% to 69%", gp: "3.00 - 3.20" },
			{ grade: "B-", marks: "60% to 64%", gp: "2.70 - 2.94" },
			{ grade: "C+", marks: "55% to 59%", gp: "2.35 - 2.63" },
			{ grade: "C", marks: "50% to 54%", gp: "2.00 - 2.28" },
			{ grade: "C-", marks: "45% to 49%", gp: "1.50 - 1.90" },
			{ grade: "D", marks: "40% to 44%", gp: "1.00 - 1.40" },
			{ grade: "F", marks: "Below 40%", gp: "0.00" },
		],
	},
	{
		slug: "gcuf_eng",
		name: "GC University Faisalabad (Engineering)",
		description: "For bachelor degrees in engineering.",
		passMark: "55%",
		rounding:
			"Ceil Round (decimals always round UP, e.g., 52.1% goes up to 53%)",
		calculation:
			"Looks up your grade points from a table. No C-, C, or D grades allowed.",
		isNew: true,
		gradeTable: [
			{ grade: "A", marks: "85% and above", gp: "4.00" },
			{ grade: "A-", marks: "80% to 84%", gp: "3.75 - 3.95" },
			{ grade: "B+", marks: "70% to 79%", gp: "3.25 - 3.70" },
			{ grade: "B", marks: "65% to 69%", gp: "3.00 - 3.20" },
			{ grade: "B-", marks: "60% to 64%", gp: "2.70 - 2.94" },
			{ grade: "C+", marks: "55% to 59%", gp: "2.35 - 2.63" },
			{ grade: "F", marks: "Below 55%", gp: "0.00" },
		],
	},
];

export default function SupportedUniversitiesPage() {
	const [openSlug, setOpenSlug] = useState<string | null>("gcuf_arts");

	const toggleAccordion = (slug: string) => {
		setOpenSlug(openSlug === slug ? null : slug);
	};

	return (
		<main className="min-h-screen bg-[#fafafa] text-slate-700 py-16 px-6 sm:px-8 selection:bg-blue-50">
			<div className="max-w-3xl mx-auto space-y-12">
				{/* Header */}
				<header className="space-y-6">
					<Link
						href="/"
						className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-wider"
					>
						<ArrowLeft className="h-3.5 w-3.5" /> Back to Home
					</Link>
					<div className="space-y-2">
						<h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
							Supported Universities
						</h1>
						<p className="text-sm text-slate-500 leading-relaxed max-w-[60ch]">
							This page shows how different universities calculate your grades
							and GPAs.
						</p>
					</div>
				</header>

				{/* Accordion List */}
				<div className="space-y-4 border-t border-slate-100 pt-8">
					{POLICIES.map((uni, idx) => {
						const isOpen = openSlug === uni.slug;

						return (
							<article
								key={uni.slug}
								data-open={isOpen ? "true" : "false"}
								className="t-acc t-stagger-item card-skeuo rounded-2xl overflow-hidden mb-3"
								style={{ animationDelay: `${idx * 40}ms` }}
							>
								{/* Trigger Header */}
								<div
									onClick={() => toggleAccordion(uni.slug)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											toggleAccordion(uni.slug);
										}
									}}
									role="button"
									tabIndex={0}
									className="flex items-center justify-between p-4 sm:p-5 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 rounded-t-2xl"
								>
									<div className="space-y-1 pr-4">
										<h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
											{uni.name}
											{uni.isNew ? (
												<span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100 uppercase tracking-wider">
													New
												</span>
											) : null}
										</h2>
										<p className="text-xs text-slate-400">{uni.description}</p>
									</div>
									<ChevronDown className="t-acc-chevron h-4.5 w-4.5 text-gray-400" />
								</div>

								{/* Collapsible Content */}
								<div className="t-acc-panel overflow-hidden">
									<div className="t-acc-panel-inner">
										<div className="p-4 sm:p-6 border-t border-slate-100/90 bg-slate-50/20 space-y-6">
											{/* Rules Grid */}
											<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
												<div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
													<span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
														Passing Mark
													</span>
													<span className="text-sm font-medium text-slate-800">
														{uni.passMark}
													</span>
												</div>
												<div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
													<span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
														Rounding Policy
													</span>
													<span className="text-sm font-medium text-slate-800">
														{uni.rounding}
													</span>
												</div>
												<div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
													<span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
														Engine Strategy
													</span>
													<span className="text-sm font-medium text-slate-800">
														{uni.calculation}
													</span>
												</div>
											</div>

											{/* Grade Table */}
											<div className="space-y-3">
												<span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block pl-1">
													Grade Point Equivalents
												</span>
												<div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
													<table className="w-full text-left text-xs border-collapse">
														<thead>
															<tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
																<th className="py-2.5 px-4">Grade</th>
																<th className="py-2.5 px-4">Marks Range</th>
																<th className="py-2.5 px-4">
																	Grade Point (GP)
																</th>
															</tr>
														</thead>
														<tbody className="divide-y divide-slate-100 text-slate-700">
															{uni.gradeTable.map((row) => (
																<tr
																	key={row.grade}
																	className="hover:bg-slate-50/20"
																>
																	<td className="py-2 px-4 font-semibold text-slate-900">
																		{row.grade}
																	</td>
																	<td className="py-2 px-4">{row.marks}</td>
																	<td className="py-2 px-4 font-mono tabular-nums">
																		{row.gp}
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
								</div>
							</article>
						);
					})}
				</div>

				<footer className="text-center pt-8 text-xs text-slate-400">
					<p>
						© {new Date().getFullYear()} GPAFlow. Calculation methods align with
						official university guidelines.
					</p>
				</footer>
			</div>
		</main>
	);
}
