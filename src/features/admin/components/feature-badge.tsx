import { Badge } from "@/components/ui/badge.tsx"
import {
	FeatureFlagStatus,
	type FeatureFlag,
} from "@/features/admin/interface/feature-flag.ts"
import type { ComponentProps, ReactNode } from "react"

type FeatureBadgeProps = {
	status: FeatureFlag["status"]
	children: ReactNode
} & Omit<ComponentProps<typeof Badge>, "variant" | "children">

export function FeatureBadge({ status, children, ...props }: FeatureBadgeProps) {
	switch (status) {
		case FeatureFlagStatus.PARTIAL:
			return (
				<Badge variant="warn" {...props}>
					{children}
				</Badge>
			)
		case FeatureFlagStatus.GLOBAL:
			return (
				<Badge variant="success" {...props}>
					{children}
				</Badge>
			)
		case FeatureFlagStatus.DISABLED:
			return (
				<Badge variant="inactive" {...props}>
					{children}
				</Badge>
			)
	}
}
