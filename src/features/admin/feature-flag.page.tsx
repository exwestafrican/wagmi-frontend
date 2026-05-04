import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.tsx"
import { useFeatureFlags } from "@/features/admin/api/list-feature-flags.ts"
import { Badge } from "@/components/ui/badge.tsx"
import { useState } from "react"
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
import { ChevronsUpDown, CircleSlash2, Globe, Plus, Split } from "lucide-react"
import {
	FeatureFlagStatus,
	type FeatureFlag,
} from "@/features/admin/interface/feature-flag.ts"

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

export function FeatureFlagPage() {
	const { data: featureFlags } = useFeatureFlags()
	const [selectedRow, setSelectedRow] = useState(0)

	function onSubmit(value: z.infer<typeof formSchema>) {
		console.log(value)
	}

	const selectedFeature = (features: FeatureFlag[], rowIdx: number) => {
		return features[rowIdx]
	}

	return (
		<div className="p-8 flex justify-start flex-col">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Feature Flag</h1>
				<div
					data-testid="feature-request-button"
					className="group rounded-full bg-muted p-1 cursor-pointer shadow-[0_0_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-muted/90 dark:bg-muted/60 dark:shadow-[0_0_10px_rgba(255,255,255,0.06)]"
				>
					<Plus className="h-5 w-5 text-green-600 group-hover:text-green-700 dark:text-green-400 dark:group-hover:text-green-300" />
				</div>
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
								>
									<TableCell className="whitespace-normal break-words min-w-0 max-w-md text-xs">
										{ff.name}
									</TableCell>

									<TableCell className="whitespace-normal break-words min-w-0 max-w-md text-xs">
										<Badge
											variant="outline"
											className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
										>
											{ff.key}
										</Badge>
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
