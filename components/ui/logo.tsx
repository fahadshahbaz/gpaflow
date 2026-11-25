import { GraduationCap } from "lucide-react";
import Link from "next/link";

interface LogoProps {
	size?: "sm" | "md" | "lg";
	href?: string;
}

const sizes = {
	sm: {
		container: "h-7 w-7 rounded-full",
		icon: "h-4 w-4",
		text: "text-lg sm:text-xl",
	},
	md: {
		container: "h-9 w-9 rounded-full",
		icon: "h-5 w-5",
		text: "text-xl sm:text-2xl",
	},
	lg: {
		container: "h-12 w-12 rounded-full",
		icon: "h-6 w-6",
		text: "text-3xl sm:text-4xl",
	},
};

export function Logo({ size = "md", href }: LogoProps) {
	const s = sizes[size];

	const logoIcon = (
		<div
			className={`flex ${s.container} aspect-square flex-shrink-0 items-center justify-center bg-blue-600 transition-[background-color,transform] duration-200 ease-out group-hover:bg-blue-500 active:scale-[0.97]`}
		>
			<GraduationCap className={`${s.icon} text-white`} />
		</div>
	);

	const content = (
		<>
			{logoIcon}
			<span className={`${s.text} font-bold tracking-tight text-gray-900`}>
				GPA<span className="text-blue-600">Flow</span>
			</span>
		</>
	);

	if (href) {
		return (
			<Link
				href={href}
				className="group inline-flex h-fit items-center gap-2.5 transition-[transform] duration-200 ease-out active:scale-[0.97]"
			>
				{content}
			</Link>
		);
	}

	return <div className="inline-flex h-fit items-center gap-2.5">{content}</div>;
}
