"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export function Navigation() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<header className="fixed top-4 right-0 left-0 z-50 px-4 sm:px-6">
			<div
				className={cn(
					"t-acc max-w-md sm:max-w-3xl mx-auto bg-white border border-slate-200/50 rounded-2xl px-4 py-2 overflow-hidden transition-[box-shadow,translate,transform] duration-300 ease-out",
					isOpen
						? "shadow-[0_24px_48px_-12px_rgba(15,23,42,0.15),0_12px_24px_-8px_rgba(15,23,42,0.1),inset_0_1px_0_#ffffff] translate-y-1"
						: "shadow-[0_8px_30px_rgba(15,23,42,0.03),inset_0_1px_0_#ffffff]",
				)}
				data-open={isOpen}
			>
				<div className="flex items-center justify-between">
					<Logo size="sm" href="/" />

					<div className="hidden items-center gap-5 sm:flex">
						<div className="flex items-center gap-1.5">
							<Link
								href="/supported-universities"
								className="px-2 py-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
							>
								Universities
							</Link>
							<Link
								href="/login"
								className="px-2 py-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
							>
								Log in
							</Link>
						</div>
						<Button
							asChild
							variant="skeuoPrimary"
							className="h-auto cursor-pointer rounded-lg px-5 py-3 text-xs font-bold"
						>
							<Link href="/signup">Get Started</Link>
						</Button>
					</div>

					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						className="t-acc-head flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-600 transition-all duration-200 hover:bg-slate-100/50 hover:text-slate-900 active:scale-90 sm:hidden"
						aria-expanded={isOpen}
						aria-label="Toggle navigation menu"
					>
						<div className="t-icon-swap h-4.5 w-4.5" data-state={isOpen ? "b" : "a"}>
							<span className="t-icon" data-icon="a">
								<Menu className="h-4.5 w-4.5" />
							</span>
							<span className="t-icon" data-icon="b">
								<X className="h-4.5 w-4.5" />
							</span>
						</div>
					</button>
				</div>

				{/* Mobile Menu Drawer (Inline Expansion) */}
				<div className="t-acc-panel sm:hidden">
					<div className="t-acc-panel-inner">
						<div className="mt-3.5 space-y-3 border-t border-slate-100/90 pt-3.5">
							<Link
								href="/supported-universities"
								onClick={() => setIsOpen(false)}
								className="block rounded-xl py-2 text-center text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
							>
								Supported Universities
							</Link>
							<div className="flex items-center justify-between gap-3 pt-0.5">
								<Link
									href="/login"
									onClick={() => setIsOpen(false)}
									className="flex-1 rounded-xl py-2.5 text-center text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
								>
									Log in
								</Link>
								<Button
									asChild
									variant="skeuoPrimary"
									className="h-10 flex-1 cursor-pointer rounded-lg font-bold"
								>
									<Link href="/signup" onClick={() => setIsOpen(false)}>
										Get Started
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
