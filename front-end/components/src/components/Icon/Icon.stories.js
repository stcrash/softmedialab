import React from 'react'
import Icon from './Icon'

export default {
	title: 'Icon',
}

const size = 100

export const Colored = () => <Icon type="google" size={size} color="#ccc" />
export const FullSize = () => <Icon type="google" />
export const Inside = () => (
	<div style={{ width: 100 }}>
		<Icon type="google" />
	</div>
)
