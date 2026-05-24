import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.tsx"
import { useFeatureFlags } from "@/features/admin/api/list-feature-flags.ts"
import { useState } from "react"

import { z } from "zod"

import { Plus } from "lucide-react"
import {
	type FeatureFlag,
	featureFormSchema,
} from "@/features/admin/interface/feature-flag.ts"
import { CreateFeatureFlagModal } from "@/features/admin/components/create-feature-flag-modal.tsx"
import { FeatureBadge } from "@/features/admin/components/feature-badge.tsx"
import FeatureFlagDetail from "@/features/admin/components/feature-flag-detail.tsx"

export function FeatureFlagPage() {
	const { data: featureFlags } = useFeatureFlags()
	const [selectedRow, setSelectedRow] = useState(0)
	const [createModalOpen, setCreateModalOpen] = useState(false)

	function onSubmit(value: z.infer<typeof featureFormSchema>) {
		console.log(value)
	}

	const selectedFeature = (features: FeatureFlag[], rowIdx: number) => {
		return features[rowIdx]
	}

	return (
		<div className="p-8 flex justify-start flex-col">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Feature Flag</h1>
				<button
					type="button"
					data-testid="create-feature-flag-button"
					onClick={() => setCreateModalOpen(true)}
					className="group rounded-full bg-muted p-1 cursor-pointer shadow-[0_0_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-muted/90 dark:bg-muted/60 dark:shadow-[0_0_10px_rgba(255,255,255,0.06)]"
				>
					<Plus className="h-5 w-5 text-green-600 group-hover:text-green-700 dark:text-green-400 dark:group-hover:text-green-300" />
				</button>
				<CreateFeatureFlagModal
					open={createModalOpen}
					onOpenChange={setCreateModalOpen}
				/>
			</div>
			<div className="flex md:flex-row gap-16 flex-col">
				<div className="md:w-3/5">
					<Table>
						<TableHeader>
							<TableRow>
								{["name", "key"].map((header) => (
									<TableHead
										key={header}
										className="text-xs capitalize text-left"
									>
										{header}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{featureFlags?.map((ff, rowIdx) => (
								<TableRow
									key={ff.key}
									data-state={selectedRow === rowIdx ? "selected" : undefined}
									onClick={() => setSelectedRow(rowIdx)}
									className="cursor-pointer"
								>
									<TableCell className="whitespace-normal break-words min-w-0 max-w-md text-xs">
										{ff.name}
									</TableCell>

									<TableCell className="whitespace-normal break-words min-w-0 max-w-md text-xs">
										<FeatureBadge status={ff.status}>{ff.key}</FeatureBadge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				<div className="md:w-2/5">
					{featureFlags && (
						<div className="flex flex-col gap-6">
							<h3 className="text-lg font-semibold">Details</h3>
							<FeatureFlagDetail
								key={selectedFeature(featureFlags, selectedRow).key}
								featureFlag={selectedFeature(featureFlags, selectedRow)}
								onSubmit={onSubmit}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
