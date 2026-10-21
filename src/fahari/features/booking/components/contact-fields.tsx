import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@common/components/ui/form"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@common/components/ui/input-group.tsx"
import { Input } from "@common/components/ui/input.tsx"
import type { Contact } from "@fahari/features/booking/schema/contact.schema.ts"
import { useFormContext } from "react-hook-form"

const inputClassName =
	"h-auto w-full rounded-[8px] border-[#89C9CA] bg-white px-3 py-2.5 text-xs text-[#012420] shadow-none placeholder:text-slate-400 aria-invalid:border-red-400 aria-invalid:ring-0 md:text-xs"

const labelClassName = "text-[11px] font-semibold text-[#012420]"

export function ContactDetails() {
	const form = useFormContext<Contact>()

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
			<div className="flex flex-col gap-3">
				<div className="flex gap-2">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem className="min-w-0 flex-1 gap-1.5">
								<FormLabel className={labelClassName}>First name *</FormLabel>
								<FormControl>
									<Input
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
									<Input
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
							<FormLabel className={labelClassName}>Email address *</FormLabel>
							<FormControl>
								<Input
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
							<InputGroup className="h-auto rounded-[8px] border-[#89C9CA] bg-white shadow-none has-[[aria-invalid=true]]:border-red-400 has-[[aria-invalid=true]]:ring-0">
								<InputGroupAddon className="border-r border-[#d7e1e8] text-xs text-[#012420]">
									Nigeria +234
								</InputGroupAddon>
								<FormControl>
									<InputGroupInput
										type="tel"
										autoComplete="tel-national"
										inputMode="tel"
										placeholder="0803 123 4567"
										className="h-auto px-3 py-2.5 text-xs text-[#012420] md:text-xs"
										{...field}
									/>
								</FormControl>
							</InputGroup>
							<FormMessage className="text-[11px]" />
						</FormItem>
					)}
				/>
			</div>
		</section>
	)
}
