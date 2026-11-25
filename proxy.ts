import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
	let response = NextResponse.next({ request });

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					for (const { name, value } of cookiesToSet) {
						request.cookies.set(name, value);
					}
					response = NextResponse.next({ request });
					for (const { name, value, options } of cookiesToSet) {
						response.cookies.set(name, value, options);
					}
				},
			},
		},
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Protected routes - redirect to login if not authenticated
	const protectedPaths = ["/dashboard"];
	const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

	if (isProtectedPath && !user) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Redirect authenticated users from home to dashboard
	if (request.nextUrl.pathname === "/" && user) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// Auth routes - redirect to dashboard if already authenticated
	const authPaths = ["/login", "/signup", "/forgot-password", "/reset-password"];
	const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path));

	if (isAuthPath && user) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - api routes (handled separately)
		 */
		"/((?!_next/static|_next/image|favicon.ico|api/).*)",
	],
};
