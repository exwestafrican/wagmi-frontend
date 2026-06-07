import { Field } from "@/components/ui/field.tsx"
import { forwardRef, useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { SendHorizontal } from "lucide-react"
import { cn } from "@/lib/utils.ts"
import useTextNodeParser from "@/features/conversation/hooks/text-node.tsx"
import type { TextNode } from "@/features/conversation/interface/text-node.ts"

const MAX_TEXT_INPUT = 2000

type EnvoyComposerProps = {
	onEnter: (textInput: string) => void
	onSend: (nodes: TextNode[]) => void
}

const EnvoyComposer = forwardRef<HTMLTextAreaElement, EnvoyComposerProps>(
	function EnvoyComposer({ onEnter, onSend }, ref) {
		const parser = useTextNodeParser()

		const [textInput, setTextInput] = useState("")

		const hasNoInput = textInput.length === 0
		const exceedsTextInput = textInput.length > MAX_TEXT_INPUT

		const invalidInput = textInput.length > MAX_TEXT_INPUT
		const disableSend = hasNoInput || exceedsTextInput
		return (
			<Field
				className={cn(
					"w-full",
					"border border-gray-300",
					"rounded-md",
					"shadow-xm",
				)}
			>
				<textarea
					ref={ref}
					value={textInput}
					maxLength={MAX_TEXT_INPUT}
					className="w-full bg-transparent border-none outline-none focus:outline-none text-sm placeholder:text-gray-400 resize-none px-5 pt-3 pb-2 min-h-[70px] font-normal leading-relaxed font-sans"
					placeholder="Message Raymond..."
					onChange={(e) => {
						parser.setText(e.target.value)
						setTextInput(e.target.value)
					}}
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
							onSend(parser.build())
						}}
					>
						<SendHorizontal />
					</Button>
				</div>
			</Field>
		)
	},
)

export default EnvoyComposer
