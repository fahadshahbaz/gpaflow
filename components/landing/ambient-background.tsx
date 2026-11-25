export function AmbientBackground() {
	return (
		<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
			<div className="bg-noise absolute inset-0 hidden opacity-[0.015] mix-blend-overlay sm:block" />
			<div className="absolute top-[-10%] left-1/2 h-[50vh] w-[80vw] -translate-x-1/2 rounded-full bg-linear-to-b from-blue-500/35 via-blue-300/10 to-transparent blur-[60px] sm:blur-[110px]" />
		</div>
	);
}
