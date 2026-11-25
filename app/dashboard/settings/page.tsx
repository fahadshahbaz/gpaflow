import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { getUser } from "@/lib/supabase/auth";

export default async function SettingsPage() {
	const user = await getUser();

	if (!user) {
		redirect("/login");
	}

	const initialName = user.user_metadata?.name || "";
	const initialEmail = user.email || "";

	return (
		<div className="flex min-h-[calc(100vh-4rem)] justify-center p-6 pt-16 sm:items-center sm:pt-0">
			<SettingsForm initialName={initialName} initialEmail={initialEmail} />
		</div>
	);
}
