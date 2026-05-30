import {
	type FeatureFlag,
	FeatureFlagStatus,
} from "@/features/admin/interface/feature-flag.ts"
import { useUpdateFeatureFlagStatus } from "@/features/admin/features/feature-flags/api/update-feature-flag-status.ts"
import { useForm, useFormState } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ChevronsUpDown } from "lucide-react"
import FeatureStatus from "src/features/admin/features/feature-flags/components/feature-status"

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

export default function FeatureFlagDetail({
	featureFlag,
}: { featureFlag: FeatureFlag }) {
	const { mutate: updateFeatureFlagStatus, isPending } =
		useUpdateFeatureFlagStatus()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: featureFlag.name,
			key: featureFlag.key,
			description: featureFlag.description,
			status: featureFlag.status,
		},
	})
	const { isDirty } = useFormState({ control: form.control })

	function handleSubmit(value: z.infer<typeof formSchema>) {
		updateFeatureFlagStatus(
			{ key: featureFlag.key, status: value.status },
			{
				onSuccess: () => {
					toast.success("Feature flag updated")
					form.reset(value)
				},
				onError: () => {
					toast.error("Could not update feature flag")
				},
			},
		)
	}

	return (
		<Form {...form}>
			<form
				className="flex max-w-md flex-col gap-5"
				onSubmit={form.handleSubmit(handleSubmit)}
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
											className="w-full justify-between cursor-pointer"
										>
											<FeatureStatus status={field.value} />
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
				<Button type="submit" disabled={!isDirty || isPending}>
					{isPending ? "Saving…" : "Save"}
				</Button>
			</form>
		</Form>
	)
}
