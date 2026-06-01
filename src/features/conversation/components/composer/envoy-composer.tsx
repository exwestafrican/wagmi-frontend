import { Field } from "@/components/ui/field.tsx"
import { useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { SendHorizontal } from "lucide-react"
import { cn } from "@/lib/utils.ts"

const MAX_TEXT_INPUT = 2000

export default function EnvoyComposer({
	onEnter,
}: { onEnter: (textInput: string) => void }) {
	const [textInput, setTextInput] = useState("")
	const hasNoInput = textInput.length == 0
	const exceedsTextInput = textInput.length > MAX_TEXT_INPUT

	const invalidInput = textInput.length > MAX_TEXT_INPUT
	const disableSend = hasNoInput || exceedsTextInput
	return (
		<Field className={cn("w-full", "border border-gray-300", "rounded-md")}>
			<textarea
				value={textInput}
				maxLength={MAX_TEXT_INPUT}
				className="w-full bg-transparent border-none outline-none focus:outline-none text-sm placeholder:text-gray-400 resize-none px-3 pt-3 pb-2 min-h-[70px]"
				placeholder="Message Raymond..."
				onChange={(e) => setTextInput(e.target.value)}
			/>
			<div className="flex flex-row gap-4 items-center justify-end px-3 pb-2 pt-0">
				<span
					className={cn(
						"text-xs",
						invalidInput ? "text-red-600" : "text-gray-400",
					)}
				>
					{textInput.length}/{MAX_TEXT_INPUT}
				</span>

				<Button
					size="icon-sm"
					className=" w-11 h-7 bg-green-950  hover:bg-green-950/90"
					disabled={disableSend}
					onClick={() => {
						console.log("Sending...")
						setTextInput("")
						onEnter(textInput)
					}}
				>
					<SendHorizontal />
				</Button>
			</div>
		</Field>
	)
}
