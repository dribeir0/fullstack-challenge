import { LanguageEN, LanguageDictionary } from '../lang/en'

export const translate = (key: LanguageDictionary) => {
    return LanguageEN[key]
}
