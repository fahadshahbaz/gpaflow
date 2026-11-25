export function Footer() {
	return (
		<footer className="relative z-10 mt-auto w-full bg-transparent py-6 text-center text-xs font-medium text-slate-500">
			<p>
				© {new Date().getFullYear()} GPAFlow. Made by{" "}
				<a
					href="https://fahadshahbaz.dev"
					target="_blank"
					rel="noopener noreferrer"
					className="text-slate-600 underline underline-offset-2 transition-colors duration-200 hover:text-slate-950"
				>
					Fahad
				</a>
				.
			</p>
		</footer>
	);
}
