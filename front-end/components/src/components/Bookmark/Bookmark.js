import React, { useState, useEffect } from 'react'
import { block } from 'bem-cn'
import Icon from '../Icon'
import { t, _t } from '../../utils/t'
import isMacOs from '../../utils/isMacOs'
import useLanguage from '../../hooks/useLanguage'
import useEscape from '../../hooks/useEscape'
import './Bookmark.scss'

const b = block('bookmark')

const Bookmark = () => {
	const language = useLanguage()
	const [isActive, setIsActive] = useState(false)
	useEscape(() => setIsActive(false))

	const onMouseOut = e => {
		if (e.clientY < 50 && e.relatedTarget == null && e.target.nodeName.toLowerCase() !== 'select') {
			document.removeEventListener('mouseout', onMouseOut, true)
			setIsActive(true)
		}
	}

	useEffect(() => {
		document.addEventListener('mouseout', onMouseOut, true)
	}, [])

	return (
		<div className={b({ 'is-active': isActive })}>
			<div className={b('inner')}>
				<div className={b('img')}>
					<Icon className={b('icon')} type="star" size={150} />
					<div className={b('line-01')} />
					<div className={b('line-02')} />
					<div className={b('line-03')} />
				</div>
				<div className={b('content')}>
					<div className={b('title')}>{t('Bookmark the site')}</div>
					<div className={b('subtitle')}>{t('to come back later')}</div>
					<div
						className={b('command')}
						dangerouslySetInnerHTML={{
							__html: _t(isMacOs() ? 'Press &laquo; Command + D &raquo;' : 'Press &laquo; Ctrl + D &raquo;', language),
						}}
					/>
				</div>
			</div>
			<button className={b('close')} title={t('Close')} onClick={() => setIsActive(false)}>
				<Icon type="close" size={40} />
			</button>
		</div>
	)
}

export default Bookmark
