import type { Device } from "@/features/admin/features/devices/interface/device.ts"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"

const formSchema = z.object({
	imei: z.string().trim(),
})

export default function DeviceDetail({ device }: { device: Device }) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		values: {
			imei: device.imei,
		},
	})

	return (
		<Form {...form}>
			<form className="flex max-w-md flex-col gap-5">
				<FormField
					control={form.control}
					name="imei"
					render={({ field }) => (
						<FormItem>
							<FormLabel>IMEI</FormLabel>
							<FormControl>
								<Input className="signup-field-input" disabled {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
