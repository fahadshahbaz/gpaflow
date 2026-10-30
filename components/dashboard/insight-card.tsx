"use client";

import { Brain, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import type { Semester } from "@/types/grading";

interface InsightCardProps {
	semesters: Semester[];
	cgpa: number;
}

const motivationalQuotes = [
	{
		quote: "Success is the sum of small efforts repeated day in and day out.",
		author: "Robert Collier",
	},
	{
		quote: "The expert in anything was once a beginner.",
		author: "Helen Hayes",
	},
	{ quote: "Education is the passport to the future.", author: "Malcolm X" },
	{
		quote:
			"The beautiful thing about learning is that no one can take it away from you.",
		author: "B.B. King",
	},
	{
		quote: "Your GPA doesn't define you, but your effort does.",
		author: "Fahad",
	},
	{
		quote: "It does not matter how slowly you go as long as you do not stop.",
		author: "Confucius",
	},
	{
		quote: "The only way to do great work is to love what you do.",
		author: "Steve Jobs",
	},
	{
		quote: "Don't let what you cannot do interfere with what you can do.",
		author: "John Wooden",
	},
	{
		quote: "Discipline is the bridge between goals and accomplishment.",
		author: "Jim Rohn",
	},
	{
		quote: "Small progress is still progress.",
		author: "Unknown",
	},
];

const tips = [
	"Review notes within 24 hours to boost retention by 60%.",
	"Break study sessions into 25-min focused blocks.",
	"Teaching others helps you understand better.",
	"Sleep 7-8 hours before exams for peak performance.",
	"Start assignments early to reduce stress.",
	"Use active recall instead of passive re-reading.",
	"Exercise before studying to improve focus and memory.",
	"Study in different locations to strengthen recall.",
	"Write summaries in your own words after each lecture.",
	"Take short breaks every hour to avoid burnout.",
];

function generateInsight(
	semesters: Semester[],
	cgpa: number,
	quoteIndex: number,
	tipIndex: number,
) {
	const randomQuote = motivationalQuotes[quoteIndex];
	const randomTip = tips[tipIndex];

	if (semesters.length === 0) {
		return {
			percentage: "0%",
			title: "Start Your Journey",
			description:
				"Add your first semester to begin tracking your academic progress.",
			gradient: "from-blue-400 via-blue-500 to-indigo-600",
			quote: randomQuote,
			tip: randomTip,
		};
	}

	if (semesters.length < 2) {
		return {
			percentage: `${((cgpa / 4) * 100).toFixed(0)}%`,
			title: "Great Start!",
			description: `You're at ${cgpa.toFixed(2)} CGPA. Keep adding semesters to track your progress.`,
			gradient: "from-blue-400 via-cyan-500 to-teal-500",
			quote: randomQuote,
			tip: randomTip,
		};
	}

	if (semesters.length >= 8) {
		return {
			percentage: "8/8",
			title: "Degree Complete",
			description: `Congratulations! You've completed your degree with a final CGPA of ${cgpa.toFixed(2)}.`,
			gradient: "from-blue-600 via-indigo-600 to-violet-700",
			quote: randomQuote,
			tip: "Congratulations on your graduation and completing your academic journey!",
		};
	}

	// Compare last two semesters
	const lastSemester = semesters[semesters.length - 1];
	const prevSemester = semesters[semesters.length - 2];
	const improvement = lastSemester.sgpa - prevSemester.sgpa;
	const percentageChange = ((improvement / prevSemester.sgpa) * 100).toFixed(0);

	if (improvement > 0) {
		return {
			percentage: `+${percentageChange}%`,
			title: "GPA Improved!",
			description: `Your SGPA increased by ${improvement.toFixed(2)} compared to ${prevSemester.name}.`,
			gradient: "from-green-400 via-emerald-500 to-teal-500",
			quote: randomQuote,
			tip: randomTip,
		};
	} else if (improvement < 0) {
		return {
			percentage: `${percentageChange}%`,
			title: "Room for Growth",
			description: `Focus on improvement. Your SGPA dropped by ${Math.abs(improvement).toFixed(2)} from last semester.`,
			gradient: "from-orange-400 via-amber-500 to-yellow-500",
			quote: randomQuote,
			tip: randomTip,
		};
	} else {
		return {
			percentage: "Stable",
			title: "Consistent Performance",
			description: "You maintained your SGPA. Keep up the steady progress!",
			gradient: "from-blue-400 via-indigo-500 to-purple-500",
			quote: randomQuote,
			tip: randomTip,
		};
	}
}

export function InsightCard({ semesters, cgpa }: InsightCardProps) {
	// Use deterministic indices for SSR, randomize on client
	const [quoteIndex, setQuoteIndex] = useState(0);
	const [tipIndex, setTipIndex] = useState(0);

	useEffect(() => {
		setQuoteIndex(Math.floor(Math.random() * motivationalQuotes.length));
		setTipIndex(Math.floor(Math.random() * tips.length));
	}, []);

	const insight = generateInsight(semesters, cgpa, quoteIndex, tipIndex);

	return (
		<div
			className={`relative overflow-hidden rounded-[32px] bg-gradient-to-br ${insight.gradient} border border-white/15 p-6 text-white h-full flex flex-col shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.02)]`}
		>
			{/* Content */}
			<div className="relative z-10 mb-4">
				<div className="flex items-start justify-between mb-3">
					<div className="flex items-center gap-2 mt-1">
						<span className="text-xs font-normal uppercase tracking-wider opacity-85">
							Insights
						</span>
					</div>
					<div className="h-9 w-9 rounded-xl bg-white/15 border border-white/10 text-white flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:rotate-12">
						<Brain className="h-4.5 w-4.5" />
					</div>
				</div>

				<div className="flex items-baseline gap-2 mt-1 mb-2">
					<span className="text-4xl font-light tracking-tight">
						{insight.percentage}
					</span>
					<span className="text-base font-normal opacity-85">
						{insight.title}
					</span>
				</div>

				<p className="text-sm opacity-85 leading-relaxed font-normal">
					{insight.description}
				</p>
			</div>

			{/* Quote or Tip */}
			<div className="relative z-10 pt-3 border-t border-white/15 mt-auto">
				<div className="flex items-start gap-2">
					<Lightbulb className="h-3.5 w-3.5 mt-0.5 opacity-65 flex-shrink-0" />
					<p className="text-xs opacity-80 leading-relaxed italic font-normal">
						"{insight.tip}"
					</p>
				</div>
			</div>
		</div>
	);
}
