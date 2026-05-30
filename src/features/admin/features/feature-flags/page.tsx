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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
	ChevronsUpDown,
	CircleSlash2,
	Globe,
	Plus,
	Split,
	Trash2,
} from "lucide-react"
import {
	FeatureFlagStatus,
	type FeatureFlag,
} from "@/features/admin/interface/feature-flag.ts"
import { CreateFeatureFlagModal } from "@/features/admin/components/create-feature-flag-modal.tsx"
import { FeatureBadge } from "@/features/admin/components/feature-badge.tsx"
import { useQueryClient } from "@tanstack/react-query"
import { useDeleteFeatureFlag } from "@/features/admin/features/feature-flags/api/delete-feature-flag.ts"

function FeatureStatus({ status }: { status: string }) {
	switch (status) {
		case FeatureFlagStatus.GLOBAL:
			return (
				<span className="flex items-center gap-2">
					<Globe className="h-4 w-4" />
					<span className="capitalize">{status}</span>
				</span>
			)
		case FeatureFlagStatus.PARTIAL:
			return (
				<span className="flex items-center gap-2">
					<Split className="h-4 w-4" />
					<span className="capitalize">{status}</span>
				</span>
			)
		default:
			return (
				<span className="flex items-center gap-2">
					<CircleSlash2 className="h-4 w-4" />
					<span className="capitalize">{status}</span>
				</span>
			)
	}
}

const formSchema = z.object({
	name: z.string().trim(),
	key: z.string().trim(),
	description: z.string().trim(),
	status: z.enum([
		FeatureFlagStatus.GLOBAL,
		FeatureFlagStatus.PARTIAL,
		FeatureFlagStatus.DISABLED,
	]),
})

function FeatureFlagDetail({
	featureFlag,
	onSubmit,
}: {
	featureFlag: FeatureFlag
	onSubmit: (value: z.infer<typeof formSchema>) => void
}) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: featureFlag.name,
			key: featureFlag.key,
			description: featureFlag.description,
			status: featureFlag.status,
		},
	})

	return (
		<Form {...form}>
			<form
				className="flex max-w-md flex-col gap-5"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input className="signup-field-input" disabled {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="key"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Key</FormLabel>
							<FormControl>
								<Input className="signup-field-input" disabled {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Input className="signup-field-input" disabled {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<FormControl>
								<DropdownMenu>
									<DropdownMenuTrigger asChild disabled>
										<Button
											type="button"
											variant="outline"
											className="w-full justify-between"
											disabled
										>
											<FeatureStatus status={featureFlag.status} />
											<ChevronsUpDown className="h-4 w-4 opacity-60" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start">
										<DropdownMenuRadioGroup
											value={field.value}
											onValueChange={field.onChange}
										>
											{[
												FeatureFlagStatus.GLOBAL,
												FeatureFlagStatus.PARTIAL,
												FeatureFlagStatus.DISABLED,
											].map((status) => (
												<DropdownMenuRadioItem key={status} value={status}>
													<FeatureStatus status={status} />
												</DropdownMenuRadioItem>
											))}
										</DropdownMenuRadioGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

export default function AdminFeatureFlagPage() {
	const queryClient = useQueryClient()

	const { data: featureFlags, isSuccess } = useFeatureFlags()
	const { mutate: deleteFeatureFlag } = useDeleteFeatureFlag()

	const [selectedFeature, setSelectedFeature] = useState<
		FeatureFlag | undefined
	>(undefined)
	const [createModalOpen, setCreateModalOpen] = useState(false)

	function onSubmit(value: z.infer<typeof formSchema>) {
		console.log(value)
	}

	useEffect(() => {
		const hasFeatures = (featureFlags ?? []).length > 0
		if (isSuccess && hasFeatures) {
			setSelectedFeature(featureFlags[0])
		}
	}, [isSuccess])

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
											<Trash2
												size={16}
												className="text-red-700"
												onClick={(e) => {
													e.stopPropagation()
													deleteFeature(ff)
												}}
											/>
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
								onSubmit={onSubmit}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
