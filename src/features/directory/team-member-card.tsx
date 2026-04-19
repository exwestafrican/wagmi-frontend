import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card.tsx"
import {
	buildTeammateRole,
	formatRole,
	fullName,
	type Teammate,
} from "@/features/workspace/interface/teammate.interface.ts"

export default function TeamMemberCard({ teammate }: { teammate: Teammate }) {
	const role = buildTeammateRole(teammate)
	return (
		<Card className="relative max-w-sm pt-0 w-72 shadow-none hover:shadow-md transition-shadow cursor-pointer">
			<div key={teammate.id} className=" bg-black/35 rounded-t-lg">
				<div className="w-full rounded-sm h-40 flex items-center justify-center text-6xl font-semibold brightness-60 grayscale dark:brightness-40 bg-neutral-300 ">
					{teammate.firstName.charAt(0).toUpperCase()}
				</div>
			</div>
			<CardHeader className="gap-2">
				<div>
					<CardTitle className="text-sm">{fullName(teammate)}</CardTitle>
					<CardDescription className="text-sm">{`@${teammate.username}`}</CardDescription>
				</div>

				<Badge
					className="cursor-pointer font-medium"
					style={{ background: role.backgroundColor, color: role.colorCode }}
				>
					{formatRole(role)}
				</Badge>
			</CardHeader>
		</Card>
	)
}
