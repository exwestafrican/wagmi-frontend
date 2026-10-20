import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@common/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const contactSchema = z.object({
	firstName: z.string().trim().nonempty({ message: "First name is required" }),
	lastName: z.string().trim().nonempty({ message: "Last name is required" }),
	email: z
		.string()
		.trim()
		.nonempty({ message: "Email address is required" })
		.pipe(z.email({ message: "Enter a valid email address" })),
	phone: z
		.string()
		.transform((value) => value.replace(/\s/g, ""))
		.pipe(
			z
				.string()
				.nonempty({ message: "Phone number is required" })
				.regex(/^0?[789]\d{9}$/, {
					message: "Enter a valid Nigerian phone number",
				}),
		),
})

export const contactFormId = "ride-contact-details"

type Contact = z.input<typeof contactSchema>

const inputClassName =
	"w-full rounded-[8px] border border-[#89C9CA] bg-white px-3 py-2.5 text-xs text-[#012420] outline-none placeholder:text-slate-400 aria-invalid:border-red-400"

const labelClassName = "text-[11px] font-semibold text-[#012420]"

export function ContactDetails() {
	const form = useForm<Contact>({
		resolver: zodResolver(contactSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
		},
	})

	return (
		<section
			className="flex flex-col gap-3 text-[#012420]"
			style={{ fontFamily: "Inter, sans-serif" }}
		>
			<div className="flex flex-col gap-1">
				<div className="flex items-baseline justify-between">
					<h2 className="text-base font-semibold">Your contact details</h2>
					<span className="text-[10px] text-slate-500">* Required</span>
				</div>
				<p className="text-[11px] leading-snug text-slate-500">
					We'll use these details to confirm your request and coordinate your
					pickup.
				</p>
			</div>
			<Form {...form}>
				<form
					id={contactFormId}
					noValidate
					onSubmit={form.handleSubmit(() => undefined)}
					className="flex flex-col gap-3"
				>
					<div className="flex gap-2">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem className="min-w-0 flex-1 gap-1.5">
									<FormLabel className={labelClassName}>First name *</FormLabel>
									<FormControl>
										<input
											autoComplete="given-name"
											placeholder="Enter first name"
											className={inputClassName}
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-[11px]" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem className="min-w-0 flex-1 gap-1.5">
									<FormLabel className={labelClassName}>Last name *</FormLabel>
									<FormControl>
										<input
											autoComplete="family-name"
											placeholder="Enter last name"
											className={inputClassName}
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-[11px]" />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="gap-1.5">
								<FormLabel className={labelClassName}>
									Email address *
								</FormLabel>
								<FormControl>
									<input
										type="email"
										autoComplete="email"
										placeholder="you@example.com"
										className={inputClassName}
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-[11px]" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem className="gap-1.5">
								<FormLabel className={labelClassName}>Phone number *</FormLabel>
								<div className="flex items-stretch rounded-[8px] border border-[#89C9CA] bg-white has-[[aria-invalid=true]]:border-red-400">
									<span className="flex items-center border-r border-[#d7e1e8] px-3 text-xs text-[#012420]">
										Nigeria +234
									</span>
									<FormControl>
										<input
											type="tel"
											autoComplete="tel-national"
											inputMode="tel"
											placeholder="0803 123 4567"
											className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-xs text-[#012420] outline-none placeholder:text-slate-400"
											{...field}
										/>
									</FormControl>
								</div>
								<FormMessage className="text-[11px]" />
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</section>
	)
}
