"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { GoogleIcon } from "@/components/ui/google-icon";
import { type AuthState, signIn, signInWithGoogle } from "@/lib/supabase/auth";

const initialState: AuthState = {};

export default function LoginPage() {
	const [state, formAction, pending] = useActionState(signIn, initialState);
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="space-y-5">
			{/* Welcome Headers */}
			<div className="space-y-1">
				<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
					Welcome Back
				</h1>
				<p className="text-sm text-gray-500">
					Enter your email and password to access your account.
				</p>
			</div>

			{state.error && (
				<div className="animate-in fade-in slide-in-from-top-1 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-xs font-medium text-rose-600 duration-200">
					{state.error}
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
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						defaultValue=""
						className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-gray-900 placeholder-slate-400 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.06)] transition-colors duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
						placeholder="fahad@example.com"
					/>
					{state.fieldErrors?.email && (
						<p className="text-xs font-medium text-rose-500">{state.fieldErrors.email[0]}</p>
					)}
				</div>

				{/* Password Input */}
				<div className="space-y-1.5">
					<label
						htmlFor="password"
						className="block text-xs font-semibold tracking-wider text-gray-400 uppercase"
					>
						Password
					</label>
					<div className="relative">
						<input
							id="password"
							name="password"
							type={showPassword ? "text" : "password"}
							required
							className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pr-11 pl-4 text-sm text-gray-900 placeholder-slate-400 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.06)] transition-colors duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
							placeholder="Enter your password"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="hover:text-gray-650 absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition"
						>
							{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>
					{state.fieldErrors?.password && (
						<p className="text-xs font-medium text-rose-500">{state.fieldErrors.password[0]}</p>
					)}
				</div>

				{/* Remember Me & Forgot Password */}
				<div className="flex items-center justify-between pt-1 text-sm">
					<label className="group flex cursor-pointer items-center gap-2 text-gray-500">
						<input
							type="checkbox"
							className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 focus:ring-offset-0"
						/>
						<span className="text-xs font-medium text-gray-500 transition group-hover:text-gray-700">
							Remember Me
						</span>
					</label>
					<Link
						href="/forgot-password"
						className="hover:text-blue-750 text-xs font-bold text-blue-600 transition hover:underline"
					>
						Forgot Your Password?
					</Link>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={pending}
					className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-x border-t border-b-[3px] border-blue-400/40 border-blue-700 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_10px_rgba(37,99,235,0.3)] transition-[transform,brightness] duration-150 hover:brightness-105 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{pending ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Signing In...
						</>
					) : (
						"Log In"
					)}
				</button>
			</form>

			{/* Divider */}
			<div className="relative my-3">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-100" />
				</div>
				<div className="relative flex justify-center text-xs font-medium text-gray-400 uppercase">
					<span className="bg-white px-3">Or Continue With</span>
				</div>
			</div>

			{/* Social Providers - Google OAuth */}
			<form action={signInWithGoogle} className="w-full">
				<button
					type="submit"
					className="bg-linear-gradient(180deg,#fff_0%,#f8fafc_100%) hover:border-slate-350 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-slate-200/80 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-[inset_0_1px_0_#ffffff,0_2px_4px_rgba(0,0,0,0.06)] transition-[transform,colors] duration-200 hover:bg-slate-50 active:scale-[0.97]"
				>
					<GoogleIcon />
					Continue with Google
				</button>
			</form>

			{/* Register Option */}
			<p className="pt-2 text-center text-xs text-gray-500">
				Don&apos;t Have An Account?{" "}
				<Link
					href="/signup"
					className="hover:text-blue-750 font-bold text-blue-600 transition hover:underline"
				>
					Register Now.
				</Link>
			</p>
		</div>
	);
}
