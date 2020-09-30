import { useContext } from 'react'
import LanguageContext from '../contexts/language'

const useLanguage = () => {
	return useContext(LanguageContext)
}

export default useLanguage
