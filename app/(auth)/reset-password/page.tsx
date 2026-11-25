"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useActionState, useState } from "react";
import { type AuthState, resetPassword } from "@/lib/supabase/auth";

const initialState: AuthState = {};

export default function ResetPasswordPage() {
	const [state, formAction, pending] = useActionState(resetPassword, initialState);
	const [showPass, setShowPass] = useState(false);
	const [showConf, setShowConf] = useState(false);

	return (
		<div className="space-y-6">
			{/* Welcome Headers */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">Reset Password</h1>
				<p className="text-sm text-gray-500">Enter your new password details below.</p>
			</div>

			{state.error && (
				<div className="animate-in fade-in slide-in-from-top-1 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-xs font-medium text-rose-600 duration-200">
					{state.error}
				</div>
			)}

			{/* Main Form */}
			<form action={formAction} className="space-y-4">
				{/* New Password Input */}
				<div className="space-y-1.5">
					<label
						htmlFor="password"
						className="block text-xs font-semibold tracking-wider text-gray-400 uppercase"
					>
						New Password
					</label>
					<div className="relative">
						<input
							id="password"
							name="password"
							type={showPass ? "text" : "password"}
							required
							minLength={6}
							className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pr-11 pl-4 text-sm text-gray-900 placeholder-slate-400 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.06)] transition-colors duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
							placeholder="Minimum 6 characters"
						/>
						<button
							type="button"
							onClick={() => setShowPass(!showPass)}
							className="hover:text-gray-650 absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition"
						>
							{showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>
				</div>

				{/* Confirm Password Input */}
				<div className="space-y-1.5">
					<label
						htmlFor="confirmPassword"
						className="block text-xs font-semibold tracking-wider text-gray-400 uppercase"
					>
						Confirm Password
					</label>
					<div className="relative">
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showConf ? "text" : "password"}
							required
							minLength={6}
							className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pr-11 pl-4 text-sm text-gray-900 placeholder-slate-400 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.06)] transition-colors duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
							placeholder="Re-enter new password"
						/>
						<button
							type="button"
							onClick={() => setShowConf(!showConf)}
							className="hover:text-gray-650 absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition"
						>
							{showConf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={pending}
					className="hover:from-blue-450 hover:to-blue-550 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-400/30 bg-gradient-to-b from-blue-500 to-blue-600 py-3 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_8px_rgba(59,130,246,0.25)] transition-[transform,colors] duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{pending ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Resetting Password...
						</>
					) : (
						"Reset Password"
					)}
				</button>
			</form>
		</div>
	);
}
