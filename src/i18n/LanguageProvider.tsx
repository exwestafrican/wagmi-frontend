import type React from 'react'
import i18n from './config'
import { I18nextProvider } from 'react-i18next'

interface LanguageProviderProps {
    children: React.ReactNode
}

const LanguageProvider:React.FC<LanguageProviderProps> = ({children}) => {
  return (
    <I18nextProvider i18n={i18n}>
        {children}
    </I18nextProvider>
  )
}

export default LanguageProvider