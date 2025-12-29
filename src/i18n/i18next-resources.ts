import enCommon from "@/i18n/translations/en/common.json"
import frCommon from "@/i18n/translations/fr/common.json"

type Locale = "en" | "fr"

const enResources = {
	common: enCommon,
}
const frResources = {
	common: frCommon,
}

const i18nResources = {
	en: enResources,
	fr: frResources,
} as const satisfies Record<Locale, typeof enResources>

export default i18nResources
