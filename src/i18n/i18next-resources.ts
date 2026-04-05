import enCommon from "@/i18n/translations/en/common.json"
import enWaitlist from "@/i18n/translations/en/waitlist.json"
import enWorkspace from "@/i18n/translations/en/workspace.json"
import frCommon from "@/i18n/translations/fr/common.json"
import frWaitlist from "@/i18n/translations/fr/waitlist.json"
import frWorkspace from "@/i18n/translations/fr/workspace.json"

type Locale = "en" | "fr"

const enResources = {
	common: enCommon,
	waitlist: enWaitlist,
	workspace: enWorkspace,
}

const frResources = {
	common: frCommon,
	waitlist: frWaitlist,
	workspace: frWorkspace,
}

const i18nResources = {
	en: enResources,
	fr: frResources,
} as const satisfies Record<Locale, typeof enResources>

export default i18nResources
