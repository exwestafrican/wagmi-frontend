import enCommon from "@/i18n/translations/en/common.json"
import enWaitlist from "@/i18n/translations/en/waitlist.json"
import enToast from "@/i18n/translations/en/toast.json"
import frCommon from "@/i18n/translations/fr/common.json"
import frWaitlist from "@/i18n/translations/fr/waitlist.json"
import frToast from "@/i18n/translations/fr/toast.json"

type Locale = "en" | "fr"

const enResources = {
	common: enCommon,
	waitlist: enWaitlist,
	toast: enToast,
}
const frResources = {
	common: frCommon,
	waitlist: frWaitlist,
	toast: frToast,
}

const i18nResources = {
	en: enResources,
	fr: frResources,
} as const satisfies Record<Locale, typeof enResources>

export default i18nResources
