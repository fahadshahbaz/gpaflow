"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	const router = useRouter();

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-6">
			<div className="max-w-md text-center">
				{/* 404 Text */}
				<h1 className="mb-4 text-8xl font-bold tracking-tight text-gray-900">
					4<span className="text-blue-500">0</span>4
				</h1>

				<h2 className="mb-3 text-2xl font-semibold text-gray-900">Page not found</h2>

				<p className="mb-8 text-gray-500">
					Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't
					exist.
				</p>

				{/* Go Back Button */}
				<Button
					type="button"
					onClick={() => router.back()}
					variant="skeuoPrimary"
					className="h-11 cursor-pointer rounded-xl px-6"
				>
					<ArrowLeft className="h-4 w-4" />
					Go back
				</Button>
			</div>
		</main>
	);
}
