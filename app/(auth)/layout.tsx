import { Logo } from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="flex min-h-screen flex-col bg-white font-sans lg:flex-row">
			{/* Left Column - Auth Form */}
			<div className="flex min-h-screen w-full flex-col justify-between bg-white p-6 sm:p-8 md:p-10 lg:w-1/2">
				{/* Top Logo */}
				<div className="flex h-fit items-center justify-start">
					<Logo href="/" />
				</div>

				{/* Form Content Wrapper */}
				<div className="mx-auto my-auto w-full max-w-105 py-4 sm:py-6">{children}</div>
			</div>
			{/* Right Column - Premium Academic Dashboard Mockup */}
			<div className="relative hidden min-h-screen w-1/2 items-center justify-center overflow-hidden bg-slate-50 p-6 lg:flex">
				{/* Vibrant Royal Blue/Sky Blue Main Panel */}
				<div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[2.5rem] bg-linear-to-br from-blue-700 via-blue-600 to-sky-600 p-12 text-white shadow-[inset_0_4px_12px_rgba(255,255,255,0.22),inset_0_-4px_12px_rgba(0,0,0,0.3),0_20px_50px_rgba(29,78,216,0.15)]">
					{/* Glowing decorative nodes */}
					<div className="pointer-events-none absolute inset-0 opacity-15">
						<div className="absolute top-[-10%] left-[-10%] h-[70%] w-[70%] rounded-full bg-white blur-[120px]" />
						<div className="absolute right-[-15%] bottom-[-15%] h-[75%] w-[75%] rounded-full bg-sky-300 blur-[130px]" />

						{/* Grid pattern overlay */}
						<svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
							<title>Grid pattern</title>
							<defs>
								<pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
									<path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
								</pattern>
							</defs>
							<rect width="100%" height="100%" fill="url(#grid)" />
						</svg>
					</div>

					{/* Top Section - Quiet branding note */}
					<div className="relative z-10">
						<span className="font-mono text-xs font-bold tracking-wider text-blue-200/70 uppercase">
							GPAFlow Predictive Platform
						</span>
					</div>

					{/* Center Area - Typographic Hero & Floating Transparent Graph */}
					<div className="relative z-10 my-auto w-full max-w-2xl space-y-8">
						<div className="space-y-6">
							<h3 className="text-4xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-5xl">
								Master your academic <br />
								<span className="bg-linear-to-r from-blue-200 to-sky-200 bg-clip-text text-transparent">
									trajectory.
								</span>
							</h3>
							<p className="text-justify text-base leading-relaxed font-light text-blue-100/80">
								GPAFlow provides a beautiful, state-of-the-art predictive dashboard to visualize
								semesters, track progression, and automate your degree planning down to the decimal.
							</p>
						</div>

						{/* Minimal line graph without bg color */}
						<div className="relative h-35 w-full pt-4 select-none">
							{/* Horizontal grid lines */}
							<div className="absolute inset-x-0 top-0 h-px bg-white/10" />
							<div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/5" />
							<div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />

							<svg className="h-full w-full overflow-visible" viewBox="0 0 500 100">
								<title>GPA Trajectory Flow</title>
								<defs>
									{/* Glow Filter for the main trend line */}
									<filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
										<feDropShadow
											dx="0"
											dy="4"
											stdDeviation="6"
											floodColor="#93c5fd"
											floodOpacity="0.4"
										/>
									</filter>
									{/* Gradient for the path */}
									<linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
										<stop offset="0%" stopColor="#93c5fd" stopOpacity="0.5" />
										<stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
										<stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
									</linearGradient>
								</defs>

								{/* The trend path */}
								<path
									d="M 15 80 Q 120 70 240 45 T 465 20"
									fill="none"
									stroke="url(#lineGrad)"
									strokeWidth="5"
									strokeLinecap="round"
									filter="url(#lineGlow)"
								/>

								{/* Glow Dots along the path */}
								<circle cx="15" cy="80" r="4" fill="#93c5fd" />
								<circle cx="240" cy="45" r="4" fill="#ffffff" />

								{/* Active end point */}
								<circle cx="465" cy="20" r="6" fill="#ffffff" />

								{/* Floating Text Markers */}
								<text
									x="15"
									y="96"
									fill="rgba(255,255,255,0.4)"
									fontSize="8"
									fontFamily="monospace"
									fontWeight="bold"
								>
									SEM 1
								</text>
								<text
									x="240"
									y="62"
									fill="rgba(255,255,255,0.6)"
									fontSize="8"
									fontFamily="monospace"
									fontWeight="bold"
								>
									SEM 2
								</text>
								<text
									x="435"
									y="38"
									fill="#ffffff"
									fontSize="9"
									fontFamily="monospace"
									fontWeight="extrabold"
								>
									3.92 CGPA
								</text>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
