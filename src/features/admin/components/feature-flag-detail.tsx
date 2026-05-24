import {type FeatureFlag, FeatureFlagStatus, featureFormSchema,} from "@/features/admin/interface/feature-flag.ts"
import {z} from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem, FormLabel,} from "@/components/ui/form.tsx"
import {Input} from "@/components/ui/input.tsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {Button} from "@/components/ui/button.tsx"
import {ChevronsUpDown} from "lucide-react"
import FeatureStatus from "@/features/admin/components/feature-status.tsx"
import {FEATURE_FLAGS} from "@/features/admin/api/list-feature-flags.ts"
import {useQueryClient} from "@tanstack/react-query"


export default function FeatureFlagDetail({
	featureFlag,
	onSubmit,
}: {
	featureFlag: FeatureFlag
	onSubmit: (value: z.infer<typeof featureFormSchema>) => void
}) {
	const queryClient = useQueryClient()


	const form = useForm<z.infer<typeof featureFormSchema>>({
		resolver: zodResolver(featureFormSchema),
		defaultValues: {
			name: featureFlag.name,
			key: featureFlag.key,
			description: featureFlag.description,
			status: featureFlag.status,
		},
	})

    const hasChanged = form.formState.isDirty;

	function updateFeatureFlag(newState: FeatureFlag) {
		queryClient.setQueryData<FeatureFlag[]>(
			[FEATURE_FLAGS],
			(previousFeatureFlags) => {
                return previousFeatureFlags?.map((ff) =>
                    ff.key === newState.key ? {...newState} : ff,
                )
			},
		)
	}

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
									<DropdownMenuTrigger asChild>
										<Button
											type="button"
											variant="outline"
											className="w-full justify-between"
										>
											<FeatureStatus status={featureFlag.status} />
											<ChevronsUpDown className="h-4 w-4 opacity-60" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="start"
										className="min-w-[var(--radix-dropdown-menu-trigger-width)] w-[var(--radix-dropdown-menu-trigger-width)]"
									>
										<DropdownMenuRadioGroup
											value={field.value}
											onValueChange={(value) => {
												updateFeatureFlag({
													...featureFlag,
													status: value as FeatureFlag["status"],
												})
												field.onChange(value)
											}}
										>
											{[
												FeatureFlagStatus.GLOBAL,
												FeatureFlagStatus.PARTIAL,
												FeatureFlagStatus.DISABLED,
											].map((status) => (
												<DropdownMenuRadioItem
													key={status}
													value={status}
													className="cursor-pointer"
												>
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
                <Button type="submit" className="cursor-pointer" disabled={!hasChanged}>
                    Update
                </Button>
			</form>
		</Form>
	)
}
