import { redirect } from "next/navigation";
import { GraduationBanner } from "@/components/dashboard/graduation-banner";
import { TopNav } from "@/components/top-nav";
import { getUser } from "@/lib/supabase/auth";
import { getDashboardStats } from "@/lib/supabase/queries";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	// Redirect to onboarding if university not selected
	if (!user.user_metadata?.university) {
		redirect("/onboarding");
	}

	const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

	const userTargetGpa = user.user_metadata?.target_gpa ?? 3.5;
	const stats = await getDashboardStats(user.id, userTargetGpa);
	const isGraduated = stats.semesterCount >= 8 && stats.cgpa >= 2.0;

	return (
		<div className="bg-background text-foreground min-h-screen">
			{isGraduated && <GraduationBanner userName={userName} cgpa={stats.cgpa} />}
			<TopNav userName={userName} userEmail={user?.email} />
			<main
				className="flex-1 pt-24"
				style={{ paddingTop: "calc(6rem + var(--banner-offset, 0px))" }}
			>
				{children}
			</main>
		</div>
	);
}
