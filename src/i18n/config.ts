import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import i18nResources from "./i18next-resources"

i18n
	// .use(HttpBackend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		ns: ["common"],
		defaultNS: "common",
		fallbackNS: "common",
		// backend: { loadPath: "/src/18n/translations/{{lng}}/{{ns}}.json" },
		debug: import.meta.env.DEV, // true in dev, false in prod
        resources: i18nResources,
		interpolation: {
			escapeValue: false,
		},
	})

export default i18n
