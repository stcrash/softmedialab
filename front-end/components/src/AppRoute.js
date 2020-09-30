import React from 'react'
import { Route } from 'react-router-dom'

const AppRoute = ({ component: Component, layout: Layout, layoutProps, ...rest }) => (
	<Route {...rest} render={props => (
		<Layout {...layoutProps} >
			<Component {...props} />
		</Layout>
	)} />
);

export default AppRoute
