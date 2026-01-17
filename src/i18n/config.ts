import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import i18nResources from "./i18next-resources"

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		load: "languageOnly",
		ns: ["common", "waitlist"],
		defaultNS: "common",
		fallbackNS: "common",
		debug: import.meta.env.DEV ?? false, // true in dev, false in prod
		resources: i18nResources,
		interpolation: {
			escapeValue: false,
		},
	})

export const t = i18n.t.bind(i18n)

export default i18n
