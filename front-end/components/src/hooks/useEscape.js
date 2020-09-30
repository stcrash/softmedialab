import { useEffect } from 'react'

/**
 * Хук, добавляющий обработчик нажатия на Escape
 * @param callback
 */
const useEscape = (callback) => {
	useEffect(() => {
		const onPressEsc = (e) => {
			if (e.key === 'Escape') callback()
		}
		document.addEventListener('keydown', onPressEsc, false)
		return () => document.removeEventListener('keydown', onPressEsc, false)
	}, [])
}

export default useEscape
