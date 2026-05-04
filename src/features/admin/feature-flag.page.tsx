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
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input.tsx"
import type { FeatureFlag } from "@/features/admin/interface/feature-flag.ts"

const formSchema = z.object({
	name: z.string().trim(),
	key: z.string().trim(),
	description: z.string().trim(),
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
								<Input
									// className="signup-field-input"
									disabled
									{...field}
								/>
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
								<Input
									// className="signup-field-input"
									disabled
									{...field}
								/>
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
								<Input
									// className="signup-field-input"
									disabled
									{...field}
								/>
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

	function onSubmit(value: z.infer<typeof formSchema>) {}

	return (
		<div className="p-8 flex justify-start flex-col">
			<h1 className="text-2xl font-semibold mb-6">Feature Flag</h1>
			<div className="flex flex-row gap-16">
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
							{featureFlags &&
								featureFlags.map((ff, rowIdx) => (
									<TableRow
										key={ff.key}
										data-state={selectedRow === rowIdx ? "selected" : undefined}
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
								featureFlag={featureFlags[selectedRow]}
								onSubmit={onSubmit}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
