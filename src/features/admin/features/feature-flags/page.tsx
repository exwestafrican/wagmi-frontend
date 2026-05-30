import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.tsx"
import {
	FEATURE_FLAGS,
	useFeatureFlags,
} from "@/features/admin/features/feature-flags/api/list-feature-flags.ts"
import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { type FeatureFlag } from "@/features/admin/interface/feature-flag.ts"
import { CreateFeatureFlagModal } from "@/features/admin/components/create-feature-flag-modal.tsx"
import { FeatureBadge } from "@/features/admin/components/feature-badge.tsx"
import { useQueryClient } from "@tanstack/react-query"
import { useDeleteFeatureFlag } from "@/features/admin/features/feature-flags/api/delete-feature-flag.ts"
import FeatureFlagDetail from "@/features/admin/features/feature-flags/components/feature-flag-detail.tsx"

export default function AdminFeatureFlagPage() {
	const queryClient = useQueryClient()

	const { data: featureFlags, isSuccess } = useFeatureFlags()
	const { mutate: deleteFeatureFlag } = useDeleteFeatureFlag()

	const [selectedFeature, setSelectedFeature] = useState<
		FeatureFlag | undefined
	>(undefined)
	const [createModalOpen, setCreateModalOpen] = useState(false)

	useEffect(() => {
		const hasFeatures = (featureFlags ?? []).length > 0
		if (isSuccess && hasFeatures) {
			setSelectedFeature(featureFlags[0])
		}
	}, [isSuccess, featureFlags])

	function deleteFeature(featureFlag: FeatureFlag) {
		const pervFeatureFlags: FeatureFlag[] | undefined =
			queryClient.getQueryData([FEATURE_FLAGS])

		if (pervFeatureFlags) {
			const filtered = pervFeatureFlags.filter(
				(prev) => prev.key !== featureFlag.key,
			)
			setSelectedFeature(filtered.length > 0 ? filtered[0] : undefined)
			queryClient.setQueryData([FEATURE_FLAGS], () => filtered)
		}

		deleteFeatureFlag(featureFlag.key)
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
									data-state={
										selectedFeature?.key === ff.key ? "selected" : undefined
									}
									onClick={() => setSelectedFeature(featureFlags[rowIdx])}
									className="cursor-pointer"
								>
									<TableCell className="whitespace-normal break-words min-w-0 max-w-md text-xs">
										{ff.name}
									</TableCell>

									<TableCell className="whitespace-normal break-words min-w-0 max-w-md text-xs">
										<div className="flex items-center justify-between">
											<FeatureBadge status={ff.status}>{ff.key}</FeatureBadge>
											<button
												type="button"
												aria-label={`Delete ${ff.key}`}
												className="cursor-pointer"
												onClick={(e) => {
													e.stopPropagation()
													deleteFeature(ff)
												}}
											>
												<Trash2 size={16} className="text-red-700" />
											</button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				<div className="md:w-2/5">
					{selectedFeature && (
						<div className="flex flex-col gap-6">
							<h3 className="text-lg font-semibold">Details</h3>
							<FeatureFlagDetail
								key={selectedFeature.key}
								featureFlag={selectedFeature}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
