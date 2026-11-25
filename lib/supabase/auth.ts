"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { authSchema, signUpSchema } from "@/lib/validations/auth";

async function getSiteUrl() {
	const headersList = await headers();
	const host = headersList.get("host") || "localhost:3000";
	const protocol = headersList.get("x-forwarded-proto") || "http";
	return `${protocol}://${host}`;
}

export type AuthState = {
	error?: string;
	success?: string;
	fieldErrors?: {
		name?: string[];
		email?: string[];
		password?: string[];
	};
};

export async function signUp(_prevState: AuthState, formData: FormData): Promise<AuthState> {
	const rawData = {
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
	};

	const result = signUpSchema.safeParse(rawData);

	if (!result.success) {
		return { fieldErrors: result.error.flatten().fieldErrors };
	}

	const supabase = await createClient();
	const siteUrl = await getSiteUrl();
	const { data, error } = await supabase.auth.signUp({
		email: result.data.email,
		password: result.data.password,
		options: {
			emailRedirectTo: `${siteUrl}/api/auth/callback`,
			data: {
				name: result.data.name,
			},
		},
	});

	if (error) {
		return { error: error.message };
	}

	// If email confirmation is required, user won't have a session
	if (data.user && !data.session) {
		return { success: "Check your email for the confirmation link" };
	}

	redirect("/dashboard");
}

export async function signIn(_prevState: AuthState, formData: FormData): Promise<AuthState> {
	const rawData = {
		email: formData.get("email"),
		password: formData.get("password"),
	};

	const result = authSchema.safeParse(rawData);

	if (!result.success) {
		return { fieldErrors: result.error.flatten().fieldErrors };
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.signInWithPassword({
		email: result.data.email,
		password: result.data.password,
	});

	if (error) {
		return { error: error.message };
	}

	redirect("/dashboard");
}

export async function signOut() {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect("/login");
}

export async function signInWithGoogle() {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: `${await getSiteUrl()}/api/auth/callback`,
		},
	});

	if (error) {
		redirect(`/login?error=${encodeURIComponent(error.message)}`);
	}

	if (data.url) {
		redirect(data.url);
	}
}

export const getUser = cache(async () => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
});

export async function forgotPassword(
	_prevState: AuthState,
	formData: FormData,
): Promise<AuthState> {
	const email = formData.get("email") as string;

	if (!email) {
		return { error: "Email is required" };
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return { error: "Please enter a valid email address" };
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${await getSiteUrl()}/api/auth/callback?type=recovery`,
	});

	if (error) {
		return { error: error.message };
	}

	return { success: "Check your email for the password reset link" };
}

export async function resetPassword(_prevState: AuthState, formData: FormData): Promise<AuthState> {
	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirmPassword") as string;

	if (!password || password.length < 6) {
		return { error: "Password must be at least 6 characters" };
	}

	if (password !== confirmPassword) {
		return { error: "Passwords do not match" };
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.updateUser({ password });

	if (error) {
		return { error: error.message };
	}

	redirect("/login");
}

export async function updateUserName(
	_prevState: AuthState,
	formData: FormData,
): Promise<AuthState> {
	const name = formData.get("name") as string;

	if (!name || name.trim().length < 2) {
		return { error: "Name must be at least 2 characters" };
	}

	if (name.trim().length > 50) {
		return { error: "Name must be less than 50 characters" };
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.updateUser({
		data: { name: name.trim() },
	});

	if (error) {
		return { error: error.message };
	}

	return { success: "Name updated successfully" };
}

export async function updateTargetGpa(targetGpa: number): Promise<AuthState> {
	if (targetGpa < 0 || targetGpa > 4) {
		return { error: "Target GPA must be between 0 and 4" };
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.updateUser({
		data: { target_gpa: targetGpa },
	});

	if (error) {
		return { error: error.message };
	}

	return { success: "Target GPA updated" };
}

export async function updateUniversity(
	university: import("@/types/grading").UniversitySlug,
): Promise<AuthState> {
	const supabase = await createClient();
	const { error } = await supabase.auth.updateUser({
		data: { university },
	});

	if (error) {
		return { error: error.message };
	}

	return { success: "University updated" };
}

export async function hasCompletedOnboarding(): Promise<boolean> {
	const user = await getUser();
	return !!user?.user_metadata?.university;
}
