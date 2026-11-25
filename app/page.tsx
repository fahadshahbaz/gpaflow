import { AmbientBackground } from "@/components/landing/ambient-background";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navigation } from "@/components/landing/navigation";

export default function HomePage() {
	return (
		<div className="relative min-h-screen w-full overflow-x-hidden bg-[#f8fafc] selection:bg-blue-100">
			<AmbientBackground />
			<div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col justify-between">
				<Navigation />
				<Hero />
				<Footer />
			</div>
		</div>
	);
}
