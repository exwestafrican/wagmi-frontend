import i18next from "i18next"
import type resources from "./i18next-resources"

declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: "common"
		fallbackNS: "common"
		resources: (typeof resources)["en"]
	}
}
