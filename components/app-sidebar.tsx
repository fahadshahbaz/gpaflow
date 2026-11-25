"use client";

import {
	Award,
	BookOpen,
	GraduationCap,
	LayoutDashboard,
	LogOut,
	Settings,
	Target,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/supabase/auth";

const navItems = [
	{ title: "Overview", href: "/dashboard", icon: LayoutDashboard },
	{ title: "Semesters", href: "/dashboard/semesters", icon: BookOpen },
	{ title: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
	{ title: "Goals", href: "/dashboard/goals", icon: Target },
	{ title: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface AppSidebarProps {
	userName?: string;
	userEmail?: string;
}

export function AppSidebar({ userName, userEmail }: AppSidebarProps) {
	const pathname = usePathname();

	return (
		<Sidebar className="border-r border-[#2a2a2a] bg-[#0f0f0f]">
			<SidebarHeader className="border-b border-[#2a2a2a] p-5">
				<Link href="/dashboard" className="flex h-fit items-center gap-3">
					<div className="from-primary to-destructive shadow-primary/20 flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-linear-to-br shadow-lg transition-transform duration-200 hover:scale-105 active:scale-98">
						<GraduationCap className="text-primary-foreground h-5 w-5" />
					</div>
					<div>
						<span className="text-lg font-bold tracking-tight text-white">GPA Flow</span>
						<p className="text-[10px] font-medium tracking-widest text-gray-500 uppercase">
							Academic Tracker
						</p>
					</div>
				</Link>
			</SidebarHeader>

			<SidebarContent className="px-3 py-6">
				<SidebarGroup>
					<SidebarGroupLabel className="mb-3 px-3 text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
						Menu
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu className="gap-1">
							{navItems.map((item) => {
								const isActive = pathname === item.href;
								return (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											className="relative h-11 rounded-xl transition-colors hover:bg-[#1a1a1a] data-[active=true]:bg-transparent"
										>
											<Link href={item.href} className="flex items-center gap-3 px-3">
												<item.icon
													className={`h-4 w-4 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
												/>
												<span
													className={`text-sm font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}
												>
													{item.title}
												</span>
												{isActive && (
													<div className="bg-primary/10 border-primary/20 animate-in fade-in-0 zoom-in-[0.97] absolute inset-0 -z-10 rounded-xl border duration-150 ease-out" />
												)}
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Stats Mini Card */}
				<SidebarGroup className="mt-6">
					<SidebarGroupContent>
						<div className="from-primary/10 to-destructive/10 border-primary/20 rounded-2xl border bg-linear-to-br p-4">
							<div className="mb-3 flex items-center gap-2">
								<Award className="text-primary h-4 w-4" />
								<span className="text-foreground text-xs font-semibold">Your Progress</span>
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between text-xs">
									<span className="text-muted-foreground">CGPA</span>
									<span className="text-primary font-semibold">3.48</span>
								</div>
								<div className="bg-secondary h-1.5 overflow-hidden rounded-full">
									<div className="from-primary to-destructive h-full w-[87%] rounded-full bg-linear-to-br" />
								</div>
								<p className="text-[10px] text-gray-500">87% to 4.0 target</p>
							</div>
						</div>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="p-4">
				<div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-4">
					<div className="mb-4 flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-gray-700 to-gray-600 text-xs font-bold text-white">
							{userName?.charAt(0).toUpperCase() || userEmail?.charAt(0).toUpperCase()}
						</div>
						<div className="min-w-0 flex-1">
							<p className="truncate text-xs font-semibold text-white">
								{userName || userEmail?.split("@")[0]}
							</p>
							<p className="truncate text-[10px] text-gray-500">{userEmail}</p>
						</div>
					</div>
					<form action={signOut}>
						<button
							type="submit"
							className="bg-secondary/10 text-muted-foreground hover:text-destructive hover:bg-destructive-500/10 border-border flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all duration-150 active:scale-[0.98]"
						>
							<LogOut className="h-3.5 w-3.5" />
							Sign Out
						</button>
					</form>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
