import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@common/components/ui/dialog"
import { useForm, useFormState } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@common/components/ui/form"
import { Input } from "@common/components/ui/input"
import { Button } from "@common/components/ui/button"
import { useCreateDevice } from "@envoye/features/admin/devices/api/create-device.ts"
import {
	registerDeviceSchema,
	type RegisterDeviceFormValues,
} from "@envoye/features/admin/devices/schema/register-device-schema.ts"
import { toast } from "sonner"
import useSpinnerVerbs from "@common/hooks/spinner-verb.ts"

const defaultValues: RegisterDeviceFormValues = {
	imei: "",
}

export function CreateDeviceModal({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const { mutate, isPending } = useCreateDevice()
	const spinnerVerb = useSpinnerVerbs()
	const form = useForm<RegisterDeviceFormValues>({
		resolver: zodResolver(registerDeviceSchema),
		defaultValues,
		mode: "onChange",
	})
	const { isValid } = useFormState({ control: form.control })

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) {
			form.reset(defaultValues)
		}
		onOpenChange(nextOpen)
	}

	function onSubmit(values: RegisterDeviceFormValues) {
		mutate(values, {
			onSuccess: () => {
				toast.success("Device registered")
				form.reset(defaultValues)
				onOpenChange(false)
			},
			onError: () => {
				toast.error("Could not register device")
			},
		})
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent data-testid="create-device-modal" className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Create device</DialogTitle>
				</DialogHeader>
				<DialogDescription className="sr-only">
					Enter IMEI for a new tracking device.
				</DialogDescription>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
						data-testid="create-device-form"
					>
						<FormField
							control={form.control}
							name="imei"
							render={({ field }) => (
								<FormItem>
									<FormLabel>IMEI</FormLabel>
									<FormControl>
										<Input
											className="signup-field-input"
											autoComplete="off"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending || !isValid}>
								{isPending ? `${spinnerVerb}...` : "Create"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
