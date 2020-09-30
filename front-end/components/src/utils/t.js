import React from 'react'
import useLanguage from '../hooks/useLanguage'
import { vsprintf } from 'sprintf-js'

const _dict = [
	{
		en: 'Bookmark the site',
		ru: 'Добавьте сайт в закладки',
	},
	{
		en: 'to come back later',
		ru: 'чтобы вернуться позже',
	},
	{
		en: 'Press &laquo; Ctrl + D &raquo;',
		ru: 'Нажмите &laquo; Ctrl + D &raquo;',
	},
	{
		en: 'Press &laquo; Command + D &raquo;',
		ru: 'Нажмите &laquo; Command + D &raquo;',
	},
]

const dict = {}
for (const i in _dict) {
	dict[_dict[i].en] = _dict[i]
}

const Template = ({ phrase, argv }) => {
	const language = useLanguage()
	const data = dict[phrase]
	if (!data) console.warn(`The phrase "${phrase}" does not exist`)
	return data ? vsprintf(data[language], argv) : phrase
}

export const t = (phrase, argv) => {
	return <Template phrase={phrase} argv={argv} />
}

export const _t = (phrase, language, argv) => {
	const data = dict[phrase]
	if (!data) console.warn(`The phrase "${phrase}" does not exist`)
	return data ? vsprintf(data[language], argv) : phrase
}

export default t
