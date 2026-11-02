import { modifyCasing, titleCase } from "@common/utils/sentence-case.ts"
import { describe, expect, test } from "vitest"

describe("titleCase", () => {
	test("capitalises every word", () => {
		expect(titleCase("ara iye")).toBe("Ara Iye")
	})

	test("keeps letters that are already capitalised", () => {
		expect(titleCase("lagos UK office")).toBe("Lagos UK Office")
	})

	test("preserves spacing", () => {
		expect(titleCase("ara  iye reception")).toBe("Ara  Iye Reception")
	})

	test("leaves an empty string alone", () => {
		expect(titleCase("")).toBe("")
	})
})

describe("modifyCasing", () => {
	test("supports title-case", () => {
		expect(modifyCasing("ara iye", "title-case")).toBe("Ara Iye")
	})
})
