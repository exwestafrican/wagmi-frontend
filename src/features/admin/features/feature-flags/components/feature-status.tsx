import { FeatureFlagStatus } from "@/features/admin/interface/feature-flag.ts"
import { CircleSlash2, Globe, Split } from "lucide-react"

export default function FeatureStatus({ status }: { status: string }) {
	switch (status) {
		case FeatureFlagStatus.GLOBAL:
			return (
				<span className="flex items-center gap-2 cursor-pointer">
					<Globe className="h-4 w-4" />
					<span className="capitalize">{status}</span>
				</span>
			)
		case FeatureFlagStatus.PARTIAL:
			return (
				<span className="flex items-center gap-2 cursor-pointer">
					<Split className="h-4 w-4" />
					<span className="capitalize">{status}</span>
				</span>
			)
		default:
			return (
				<span className="flex items-center gap-2 cursor-pointer">
					<CircleSlash2 className="h-4 w-4" />
					<span className="capitalize">{status}</span>
				</span>
			)
	}
}
