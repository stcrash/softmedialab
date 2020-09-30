import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Bookmark from "../../components/Bookmark";

const MainLayout = props => (
	<div>
		<ul>
			<li><Link to="/" title="Home">Home</Link></li>
			<li><Link to="/page" title="Page">Page</Link></li>
		</ul>
		<Bookmark />
		<p>Компонент Bookmark появится при удалении курсора с вьюпорта наверх</p>
		{props.children}
	</div>
);

MainLayout.propTypes = {
	children: PropTypes.any.isRequired
};

export default MainLayout;
