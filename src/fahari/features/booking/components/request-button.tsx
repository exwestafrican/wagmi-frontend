import { ArrowRight } from "lucide-react"

export function RequestButton({ formIds }: { formIds: string[] }) {
	return (
		<button
			type="button"
			onClick={() => {
				for (const formId of formIds) {
					const form = document.getElementById(formId)
					if (form instanceof HTMLFormElement) form.requestSubmit()
				}
			}}
			className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#10241c] px-4 py-2.5 text-[13px] font-semibold text-white"
		>
			Request this car
			<ArrowRight className="size-3.5" aria-hidden />
		</button>
	)
}
