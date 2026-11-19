import { Button, ThemeToggle } from "@fahari/components/ui/button.tsx"
import { Segmented, Stepper } from "@fahari/components/ui/controls.tsx"
import { TextField } from "@fahari/components/ui/field.tsx"
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
})
