"use client";

import dynamic from "next/dynamic";

export const GPATrendChartLazy = dynamic(
	() => import("./gpa-trend-chart").then((mod) => mod.GPATrendChart),
	{
		ssr: false,
		loading: () => (
			<div className="h-[254px] w-full animate-pulse rounded-[32px] border border-slate-200/50 bg-slate-100/50" />
		),
	},
);
