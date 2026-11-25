"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { GoogleIcon } from "@/components/ui/google-icon";
import { type AuthState, signInWithGoogle, signUp } from "@/lib/supabase/auth";

const initialState: AuthState = {};

export default function SignupPage() {
	const [state, formAction, pending] = useActionState(signUp, initialState);
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="space-y-5">
			{/* Welcome Headers */}
			<div className="space-y-1">
				<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
					Create Account
				</h1>
				<p className="text-sm text-gray-500">
					Enter your details below to create your academic profile.
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
				{/* Name Input */}
				<div className="space-y-1.5">
					<label
						htmlFor="name"
						className="block text-xs font-semibold tracking-wider text-gray-400 uppercase"
					>
						Full Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						defaultValue=""
						className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-gray-900 placeholder-slate-400 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.06)] transition-colors duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
						placeholder="Fahad Shahbaz"
					/>
					{state.fieldErrors?.name && (
						<p className="text-xs font-medium text-rose-500">{state.fieldErrors.name[0]}</p>
					)}
				</div>

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
							placeholder="Create a password"
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

				{/* Agree to terms visual checkbox */}
				<div className="flex items-start gap-2 pt-1 text-xs text-gray-500">
					<input
						type="checkbox"
						required
						id="terms"
						className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 focus:ring-offset-0"
					/>
					<label htmlFor="terms" className="cursor-pointer leading-relaxed font-medium">
						I agree to the{" "}
						<Link
							href="/terms"
							className="hover:text-blue-750 font-bold text-blue-600 transition hover:underline"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							href="/privacy"
							className="hover:text-blue-750 font-bold text-blue-600 transition hover:underline"
						>
							Privacy Policy
						</Link>
						.
					</label>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={pending}
					className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-x border-t border-b-[3px] border-blue-700 bg-linear-to-b from-blue-500 via-blue-600 to-blue-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_10px_rgba(37,99,235,0.3)] transition-[transform,brightness] duration-150 hover:brightness-105 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{pending ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Creating Account...
						</>
					) : (
						"Register"
					)}
				</button>
			</form>

			{/* Divider */}
			<div className="relative my-3">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-100" />
				</div>
				<div className="relative flex justify-center text-xs font-medium text-gray-400 uppercase">
					<span className="bg-white px-3">Or Register With</span>
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

			{/* Login Option */}
			<p className="pt-2 text-center text-xs text-gray-500">
				Already Have An Account?{" "}
				<Link
					href="/login"
					className="hover:text-blue-750 font-bold text-blue-600 transition hover:underline"
				>
					Log In Now.
				</Link>
			</p>
		</div>
	);
}
