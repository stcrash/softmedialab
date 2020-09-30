import React from 'react'
import PropTypes from 'prop-types'
import { block } from 'bem-cn'
import './Icon.scss'
import icons from './img'
import { ReactSVG } from 'react-svg'

const b = block('icon')

const Icon = ({ type, size, color, className }) => {
	const svg = icons[type]
	if (!svg) return null

	return (
		<i
			className={b(null).mix(className)}
			style={{
				...(size && { width: size, height: size }),
				...(color && { color }),
			}}
		>
			<ReactSVG src={svg} />
		</i>
	)
}

Icon.propTypes = {
	type: PropTypes.string,
	size: PropTypes.number,
	color: PropTypes.string,
	className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

Icon.defaultProps = {
	size: 24,
}

export default Icon
