"use client";

import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { type AuthState, updateUserName } from "@/lib/supabase/auth";

interface SettingsFormProps {
	initialName: string;
	initialEmail: string;
}

export function SettingsForm({ initialName, initialEmail }: SettingsFormProps) {
	const router = useRouter();
	const [state, formAction, isPending] = useActionState<AuthState, FormData>(updateUserName, {});

	// Refresh server components to update layouts (like TopNav) on success
	useEffect(() => {
		if (state.success) {
			router.refresh();
		}
	}, [state.success, router]);

	return (
		<div className="mx-auto w-full max-w-xl">
			{/* Settings Card */}
			<div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
				{/* Avatar / Profile Header */}
				<div className="flex flex-col items-center gap-5 border-b border-slate-100 p-6 text-center sm:flex-row sm:items-start sm:p-8 sm:text-left">
					<div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-blue-500/20 bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-sm">
						<span className="text-3xl font-bold">
							{initialName?.charAt(0)?.toUpperCase() ||
								initialEmail?.charAt(0)?.toUpperCase() ||
								"U"}
						</span>
					</div>
					<div>
						<h1 className="text-2xl font-bold text-slate-900">{initialName || "Your Profile"}</h1>
						<p className="mt-1 text-sm text-slate-500">{initialEmail}</p>
					</div>
				</div>

				{/* Form Section */}
				<div className="p-6 sm:p-8">
					<form action={formAction} className="space-y-6">
						{/* Name Field */}
						<div>
							<label
								htmlFor="name"
								className="mb-2 block cursor-pointer text-sm font-semibold text-slate-700"
							>
								Display Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								defaultValue={initialName}
								placeholder="Enter your display name"
								className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
							/>
						</div>

						{/* Email Field (Read-only) */}
						<div>
							<span className="mb-2 block text-sm font-semibold text-slate-700">Email Address</span>
							<div className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 opacity-80">
								{initialEmail}
							</div>
							<p className="mt-2 text-xs font-medium text-slate-400">
								Email address cannot be changed
							</p>
						</div>

						{/* Status Messages */}
						{state.error && (
							<div className="animate-in fade-in slide-in-from-top-1 rounded-xl border border-rose-100 bg-rose-50 p-3.5 duration-200">
								<p className="text-sm font-medium text-rose-600">{state.error}</p>
							</div>
						)}

						{state.success && (
							<div className="animate-in fade-in slide-in-from-top-1 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3.5 duration-200">
								<Check className="h-4 w-4 text-emerald-500" />
								<p className="text-sm font-medium text-emerald-600">{state.success}</p>
							</div>
						)}

						{/* Submit Button */}
						<div className="pt-2">
							<Button
								type="submit"
								variant="skeuoPrimary"
								disabled={isPending}
								className="h-11 w-full cursor-pointer rounded-xl text-sm font-bold"
							>
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									"Save Changes"
								)}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
