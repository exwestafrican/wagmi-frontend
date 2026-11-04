import { productFromHost } from "@common/product-from-host.ts"
import { describe, expect, test } from "vitest"

describe("productFromHost", () => {
	test("treats envoye hosts as Envoye", () => {
		expect(productFromHost("envoye.co")).toBe("envoye")
		expect(productFromHost("www.envoye.co")).toBe("envoye")
		expect(productFromHost("envoye.localhost")).toBe("envoye")
		expect(productFromHost("Envoye.CO")).toBe("envoye")
	})

	test("treats fahari hosts as Fahari", () => {
		expect(productFromHost("fahari.io")).toBe("fahari")
		expect(productFromHost("www.fahari.io")).toBe("fahari")
		expect(productFromHost("fahari.localhost")).toBe("fahari")
		expect(productFromHost("Fahari.Localhost")).toBe("fahari")
	})

	test("defaults unknown hosts, including localhost, to Envoye", () => {
		expect(productFromHost("localhost")).toBe("envoye")
		expect(productFromHost("127.0.0.1")).toBe("envoye")
	})
})
