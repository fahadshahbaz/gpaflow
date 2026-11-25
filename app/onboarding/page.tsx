"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { updateUniversity } from "@/lib/supabase/auth";
import { UNIVERSITIES, type UniversitySlug } from "@/types/grading";

// Build university options from the UNIVERSITIES constant
const universityOptions = [
	...Object.values(UNIVERSITIES).map((uni) => ({
		id: uni.slug,
		name: uni.name,
		fullName: uni.fullName,
		description: uni.description,
		available: true,
	})),
	{
		id: null as UniversitySlug | null,
		name: "Other",
		fullName: "Other Universities",
		description: "Coming soon - contribute your university's formula!",
		available: false,
	},
];

export default function OnboardingPage() {
	const router = useRouter();
	const [selected, setSelected] = useState<UniversitySlug | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleContinue = async () => {
		if (!selected) return;

		setLoading(true);
		setError(null);

		const result = await updateUniversity(selected);

		if (result.error) {
			setError(result.error);
			setLoading(false);
			return;
		}

		router.push("/dashboard");
	};

	return (
		<main className="bg-background text-foreground min-h-screen px-4 pt-16">
			<div className="mx-auto w-full max-w-2xl space-y-8">
				<div className="text-center">
					<div className="mb-6 inline-flex items-center justify-center">
						<Logo href="/" />
					</div>
					<h1 className="text-2xl font-bold text-gray-900">Select your university</h1>
					<p className="mt-2 text-gray-500">
						We'll use the correct grading formula for your institution
					</p>
				</div>

				{error && (
					<div className="rounded-lg border border-red-100 bg-red-50 p-3 text-center text-sm text-red-600">
						{error}
					</div>
				)}

				<div className="grid gap-4">
					{universityOptions.map((uni) => (
						<button
							key={uni.name}
							type="button"
							disabled={!uni.available}
							onClick={() => uni.id && setSelected(uni.id)}
							className={`relative rounded-2xl border-2 p-6 text-left transition-all ${
								uni.available
									? selected === uni.id
										? "card-shadow border-blue-500 bg-blue-50/50"
										: "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
									: "cursor-not-allowed border-gray-100 bg-gray-50 opacity-60"
							} `}
						>
							<div className="flex items-start justify-between">
								<div>
									<h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
										{uni.name}
										{uni.id?.startsWith("gcuf_") && (
											<span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">
												Undergrad Only
											</span>
										)}
									</h3>
									<p className="mt-0.5 text-sm text-gray-500">{uni.fullName}</p>
									<p className="mt-2 text-sm text-gray-400">{uni.description}</p>
								</div>
								{uni.available && (
									<div
										className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
											selected === uni.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
										} `}
									>
										{selected === uni.id && (
											<svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
												<title>Selected</title>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										)}
									</div>
								)}
								{!uni.available && (
									<span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-400">
										Coming Soon
									</span>
								)}
							</div>
						</button>
					))}
				</div>

				<button
					type="button"
					onClick={handleContinue}
					disabled={!selected || loading}
					className="w-full rounded-xl bg-blue-500 px-4 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{loading ? "Setting up..." : "Continue to Dashboard"}
				</button>

				<p className="text-center text-xs text-gray-400">You can change this later in settings</p>
			</div>
		</main>
	);
}
