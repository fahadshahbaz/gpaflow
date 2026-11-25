import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
	return (
		<section className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 pt-32 pb-16 sm:px-8">
			<div className="mt-4 grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
				{/* Left Typography Column */}
				<div className="animate-in fade-in-0 slide-in-from-bottom-4 mx-auto flex max-w-xl flex-col items-center text-center duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:col-span-7 lg:mx-0 lg:max-w-none lg:items-start lg:text-left">
					<h1 className="mb-5 text-4xl leading-[1.05] font-extrabold tracking-[-0.03em] text-balance text-slate-900 sm:text-5xl lg:text-6xl">
						Track, calculate, and forecast your{" "}
						<span className="bg-linear-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
							GPA.
						</span>
					</h1>

					<p className="mx-auto mb-8 max-w-md text-base leading-relaxed font-medium text-pretty text-slate-500 sm:text-lg lg:mx-0">
						Calculate semester grades, set target goals, and simulate future scenarios to manage
						your academic progress with precision.
					</p>

					<div className="flex w-full flex-col items-center gap-3.5 sm:w-auto sm:flex-row">
						<Link
							href="/signup"
							className="btn-skeuo-primary group flex h-12 w-full max-w-70 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold sm:w-auto"
						>
							Start Tracking
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Link>
						<Link
							href="/login"
							className="btn-skeuo-white flex h-12 w-full max-w-70 items-center justify-center rounded-xl px-6 text-sm font-bold text-slate-700 sm:w-auto"
						>
							View Dashboard
						</Link>
					</div>
				</div>

				{/* Right Custom Vector Art Illustration Column */}
				<div className="animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 fill-mode-both mx-auto w-full max-w-105 delay-100 duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] lg:col-span-5 lg:mx-0 lg:ml-auto">
					<AcademicIllustration />
				</div>
			</div>
		</section>
	);
}

function AcademicIllustration() {
	return (
		<div className="relative flex w-full items-center justify-center">
			{/* Ambient glows */}
			<div className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-tr from-blue-400/10 via-sky-300/5 to-transparent blur-[80px]" />

			<Image
				src="/study.svg"
				alt="Academic Study Illustration"
				width={420}
				height={320}
				priority
				className="relative z-10 h-auto w-full object-contain"
			/>
		</div>
	);
}
