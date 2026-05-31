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
import {
	type FeatureFlag,
	FeatureFlagStatus,
} from "@/features/admin/interface/feature-flag.ts"
import { CreateFeatureFlagModal } from "@/features/admin/components/create-feature-flag-modal.tsx"
import { FeatureBadge } from "@/features/admin/components/feature-badge.tsx"
import { useQueryClient } from "@tanstack/react-query"
import { useDeleteFeatureFlag } from "@/features/admin/features/feature-flags/api/delete-feature-flag.ts"
import FeatureFlagDetail from "@/features/admin/features/feature-flags/components/feature-flag-detail.tsx"

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs.tsx"
import useFeatureEnrollment, {} from "@/features/admin/features/feature-flags/api/enrollment.ts"
import { Switch } from "@/components/ui/switch.tsx"
import { Label } from "@/components/ui/label.tsx"
import { cn } from "@/lib/utils.ts"
import useUpdateEnrollment from "@/features/admin/features/feature-flags/api/update-enrollment.ts"

export default function AdminFeatureFlagPage() {
	const queryClient = useQueryClient()

	const { data: featureFlags, isSuccess } = useFeatureFlags()
	const { mutate: deleteFeatureFlag } = useDeleteFeatureFlag()
	const { mutate: updateEnrollment } = useUpdateEnrollment()

	const [createModalOpen, setCreateModalOpen] = useState(false)
	const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined)

	const selectedFeature = featureFlags?.find((f) => f.key === selectedKey)

	const { data: featureEnrollment } = useFeatureEnrollment(selectedKey)

	useEffect(() => {
		if (!isSuccess) return
		if (selectedFeature) return

		const hasFeatures = (featureFlags ?? []).length > 0
		if (hasFeatures) {
			setSelectedKey(featureFlags[0].key)
		}
	}, [isSuccess, featureFlags])

	function deleteFeature(featureFlag: FeatureFlag) {
		const pervFeatureFlags: FeatureFlag[] | undefined =
			queryClient.getQueryData([FEATURE_FLAGS])

		if (pervFeatureFlags) {
			const filtered = pervFeatureFlags.filter(
				(prev) => prev.key !== featureFlag.key,
			)
			setSelectedKey(filtered.length > 0 ? filtered[0].key : undefined)
			queryClient.setQueryData([FEATURE_FLAGS], () => filtered)
		}

		deleteFeatureFlag(featureFlag.key)
	}

	const canEditEnrollment =
		selectedFeature &&
		(selectedFeature.status == FeatureFlagStatus.GLOBAL ||
			selectedFeature.status == FeatureFlagStatus.DISABLED)

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
									onClick={() => setSelectedKey(featureFlags[rowIdx].key)}
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
					<Tabs defaultValue="details">
						<TabsList variant="line">
							{["details", "apps"].map((tab) => (
								<TabsTrigger
									key={tab}
									value={tab}
									className="capitalize cursor-pointer mb-8"
								>
									{tab.split("-").join(" ")}
								</TabsTrigger>
							))}
						</TabsList>
						{selectedFeature && (
							<>
								<TabsContent value="details">
									<FeatureFlagDetail
										key={selectedFeature.key}
										featureFlag={selectedFeature}
									/>
								</TabsContent>
								<TabsContent value="apps">
									<div className="space-y-2">
										<div className="flex items-center justify-between w-3/5">
											<span className="text-xs capitalize text-muted-foreground">
												App
											</span>
											<span className="text-xs capitalize text-muted-foreground">
												Enabled
											</span>
										</div>
										<div className="space-y-2">
											{(featureEnrollment ?? []).map((enrollment) => {
												return (
													<div
														key={enrollment.appId}
														className="flex items-center justify-between w-3/5"
													>
														<Label
															htmlFor={enrollment.appId}
															className={`text-sm ${enrollment.hasFeature ? "text-black" : "text-gray-500"} capitalize`}
														>
															{enrollment.name}
														</Label>
														<Switch
															className={cn(
																"cursor-pointer",
																"data-[state=checked]:bg-green-600",
																"dark:data-[state=checked]:bg-green-500",
															)}
															id={enrollment.appId}
															disabled={canEditEnrollment}
															aria-label={`Enable ${enrollment.name}`}
															key={`${selectedKey}-${enrollment.appId}-${enrollment.hasFeature}`}
															checked={enrollment.hasFeature}
															onCheckedChange={(checked) => {
																const updatedEnrollment = {
																	...enrollment,
																	hasFeature: checked,
																}
																updateEnrollment({
																	featureKey: selectedFeature.key,
																	enrollment: updatedEnrollment,
																})
															}}
														/>
													</div>
												)
											})}
										</div>
									</div>
								</TabsContent>
							</>
						)}
					</Tabs>
				</div>
			</div>
		</div>
	)
}
