/**
 * Является ли текущая платформа MacOS
 * @returns {boolean}
 */
const isMacOs = () => {
	if (typeof window === 'undefined') return false
	return /(mac)/i.test(window.navigator.platform)
}

export default isMacOs
