"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { type AuthState, forgotPassword } from "@/lib/supabase/auth";

const initialState: AuthState = {};

export default function ForgotPasswordPage() {
	const [state, formAction, pending] = useActionState(forgotPassword, initialState);

	return (
		<div className="space-y-6">
			{/* Welcome Headers */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">Forgot Password</h1>
				<p className="text-sm text-gray-500">
					Enter your email below to receive a password reset link.
				</p>
			</div>

			{state.error && (
				<div className="animate-in fade-in slide-in-from-top-1 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-xs font-medium text-rose-600 duration-200">
					{state.error}
				</div>
			)}

			{state.success && (
				<div className="animate-in fade-in slide-in-from-top-1 rounded-xl border border-emerald-100 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-600 duration-200">
					{state.success}
				</div>
			)}

			{/* Main Form */}
			<form action={formAction} className="space-y-4">
				{/* Email Input */}
				<div className="space-y-1.5">
					<label
						htmlFor="email"
						className="block text-xs font-semibold tracking-wider text-gray-400 uppercase"
					>
						Email Address
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						defaultValue=""
						className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-gray-900 placeholder-slate-400 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.06)] transition-colors duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
						placeholder="fahad@example.com"
					/>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={pending}
					className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-x border-t border-b-[3px] border-blue-400/40 border-blue-700 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 px-4 py-3 text-sm font-extrabold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_10px_rgba(37,99,235,0.3)] transition-[transform,brightness] duration-150 hover:brightness-105 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{pending ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Sending Link...
						</>
					) : (
						"Send Reset Link"
					)}
				</button>
			</form>

			{/* Back to login option */}
			<div className="pt-2 text-center">
				<Link
					href="/login"
					className="hover:text-blue-750 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 transition hover:underline"
				>
					<ArrowLeft className="h-3.5 w-3.5" />
					Back to Log In
				</Link>
			</div>
		</div>
	);
}
