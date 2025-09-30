import { describe, expect, test } from "vitest"
import { formatFileSize } from "@/utils/formatFileSize"

describe("formatFileSize", () => {
	test("should format large file sizes correctly", () => {
		// Create a mock file with 10.75MB
		const mockFile = {
			size: 10.75 * 1024 * 1024, // 10.75MB in bytes
			name: "large-file.xlsx",
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		} as File

		const result = formatFileSize(mockFile)
		expect(result).toBe("10.75 MB")
	})

	test("should format file size with zero bytes", () => {
		// Create a mock file with 0 bytes
		const mockFile = {
			size: 0,
			name: "empty.txt",
			type: "text/plain",
		} as File

		const result = formatFileSize(mockFile)
		expect(result).toBe("0.00 KB")
	})

	test("should maintain consistent decimal places", () => {
		// Test that all results have exactly 2 decimal places
		const testCases = [
			{ size: 1024, expected: "1.00 KB" }, // 1KB
			{ size: 1024 * 1024, expected: "1.00 MB" }, // 1MB
			{ size: 1536, expected: "1.50 KB" }, // 1.5KB
			{ size: 1.5 * 1024 * 1024, expected: "1.50 MB" }, // 1.5MB
			{ size: 2.5 * 1024 * 1024, expected: "2.50 MB" }, // 2.5MB
			{ size: 0.99 * 1024 * 1024, expected: "1013.76 KB" }, // 0.99MB in bytes
			{ size: 256.5 * 1024, expected: "256.50 KB" }, // 256KB
			{ size: 512 * 1024, expected: "512.00 KB" }, // 512KB
			{ size: 512, expected: "0.50 KB" }, // 0.50 KB
		]

		testCases.forEach(({ size, expected }) => {
			const mockFile = {
				size,
				name: "test.txt",
				type: "text/plain",
			} as File

			const result = formatFileSize(mockFile)
			expect(result).toBe(expected)
		})
	})
})
