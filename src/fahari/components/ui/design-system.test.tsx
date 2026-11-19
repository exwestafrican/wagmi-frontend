import {
	Button,
	InterestedButton,
	ThemeToggle,
} from "@fahari/components/ui/button.tsx"
import {
	Segmented,
	Stepper,
	UploadBox,
} from "@fahari/components/ui/controls.tsx"
import { TextField, TimeField } from "@fahari/components/ui/field.tsx"
import { FahariTheme } from "@fahari/theme/fahari-theme.tsx"
import { useFahariThemeStore } from "@fahari/theme/theme.store.ts"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

describe("Fahari design system", () => {
	it("blocks clicks and shows a spinner while a button is loading", async () => {
		const onClick = vi.fn()
		render(
			<Button loading onClick={onClick}>
				Book a spot
			</Button>,
		)

		const button = screen.getByRole("button", { name: /book a spot/i })
		await userEvent.click(button)

		expect(button).toBeDisabled()
		expect(button).toHaveAttribute("aria-busy", "true")
		expect(screen.getByTitle("Loading")).toBeInTheDocument()
		expect(onClick).not.toHaveBeenCalled()
	})

	it("keeps the stepper between its minimum and maximum", async () => {
		function Harness() {
			const [value, setValue] = useState(1)
			return <Stepper value={value} onChange={setValue} max={2} />
		}
		render(<Harness />)

		const decrease = screen.getByRole("button", { name: "Decrease" })
		const increase = screen.getByRole("button", { name: "Increase" })
		expect(decrease).toBeDisabled()

		await userEvent.click(increase)

		expect(screen.getByRole("status")).toHaveTextContent("2")
		expect(increase).toBeDisabled()
		expect(decrease).toBeEnabled()
	})

	it("shows the error instead of the helper and marks the input invalid", () => {
		render(
			<TextField
				label="Event title"
				helper="Keep it short and clear."
				error="Add an event title"
			/>,
		)

		const input = screen.getByLabelText("Event title")
		expect(input).toBeInvalid()
		expect(input).toHaveAccessibleDescription("Add an event title")
		expect(
			screen.queryByText("Keep it short and clear."),
		).not.toBeInTheDocument()
	})

	it("keeps one segmented option selected when the chosen one is clicked again", async () => {
		const onValueChange = vi.fn()
		render(
			<Segmented
				aria-label="Ticket type"
				value="free"
				onValueChange={onValueChange}
				options={[
					{ value: "free", label: "Free (RSVP)" },
					{ value: "paid", label: "Paid (tickets)" },
				]}
			/>,
		)

		await userEvent.click(screen.getByRole("radio", { name: "Free (RSVP)" }))
		expect(onValueChange).not.toHaveBeenCalled()

		await userEvent.click(screen.getByRole("radio", { name: "Paid (tickets)" }))
		expect(onValueChange).toHaveBeenCalledWith("paid")
	})

	it("themes the whole document while mounted and switches mode from the toggle", async () => {
		useFahariThemeStore.setState({ mode: "light" })
		const { unmount } = render(
			<FahariTheme>
				<ThemeToggle />
			</FahariTheme>,
		)
		const root = document.documentElement
		expect(root).toHaveClass("fahari")
		expect(root).not.toHaveClass("dark")

		await userEvent.click(
			screen.getByRole("button", { name: "Switch to dark mode" }),
		)
		expect(root).toHaveClass("dark")

		unmount()
		expect(root).not.toHaveClass("fahari")
		expect(root).not.toHaveClass("dark")
	})

	it("picks a time from the list and skips times that are switched off", async () => {
		function Harness() {
			const [time, setTime] = useState<string>()
			return (
				<TimeField
					label="Start time"
					value={time}
					onChange={setTime}
					isTimeDisabled={(option) => option < "08:00"}
				/>
			)
		}
		render(<Harness />)

		const field = screen.getByRole("button", { name: /start time/i })
		expect(field).toHaveTextContent("Select time")

		await userEvent.click(field)
		expect(screen.getByRole("button", { name: "7:45 AM" })).toBeDisabled()
		await userEvent.click(screen.getByRole("button", { name: "2:30 PM" }))

		expect(field).toHaveTextContent("2:30 PM")
		expect(
			screen.queryByRole("button", { name: "2:45 PM" }),
		).not.toBeInTheDocument()
	})

	it("previews the chosen image and lets it be removed", async () => {
		URL.createObjectURL = vi.fn(() => "blob:cover")
		URL.revokeObjectURL = vi.fn()
		const cover = new File(["x"], "cover.png", { type: "image/png" })

		function Harness() {
			const [file, setFile] = useState<File>()
			return (
				<UploadBox
					accept="image/*"
					value={file}
					onFiles={(files) => setFile(files[0])}
					onRemove={() => setFile(undefined)}
				/>
			)
		}
		const { container } = render(<Harness />)

		const input = container.querySelector<HTMLInputElement>("input[type=file]")
		if (!input) throw new Error("file input not found")
		await userEvent.upload(input, cover)

		expect(
			await screen.findByRole("img", { name: "Chosen file" }),
		).toHaveAttribute("src", "blob:cover")

		await userEvent.click(screen.getByRole("button", { name: "Remove file" }))

		expect(screen.queryByRole("img")).not.toBeInTheDocument()
		expect(screen.getByText("Upload cover image")).toBeInTheDocument()
	})

	it("tells assistive tech whether the interested star is on", () => {
		const { rerender } = render(<InterestedButton interested={false} />)
		expect(
			screen.getByRole("button", { name: "I'm interested" }),
		).toHaveAttribute("aria-pressed", "false")

		rerender(<InterestedButton interested />)
		expect(
			screen.getByRole("button", { name: "Remove from interested" }),
		).toHaveAttribute("aria-pressed", "true")
	})
})
