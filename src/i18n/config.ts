import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      he: {
        translation: {
          // Hebrew translations will go here
        }
      },
      en: {
        translation: {
          // English translations will go here
        }
      },
      ar: {
        translation: {
          // Arabic translations will go here
        }
      }
    },
    fallbackLng: 'he',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n 