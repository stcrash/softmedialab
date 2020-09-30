import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

export const WITH_USER_QUERY = gql`
    query User{
        user{
            _id
				loginName
				fullName
				profile{
					 name
					 surname
					 patronymic
					 avatar{
						  url
					 }
				}
        }
    }
`;

/**
 * HOC добавляющий props текущего пользователя
 *
 * Загрузка пользователя
 * userLoading: PropTypes.bool.isRequired
 *
 * Текущий пользователь
 * user: PropTypes.object
 *
 * @param ChildComponent
 * @returns {*}
 */
export const withUser = ChildComponent => {

	const withUserQuery = graphql(WITH_USER_QUERY, {
		props: ({ data }) => {
			if (data.error) return null;
			const { user, loading } = data;
			return {
				user,
				userLoading: loading
			};
		},
	});

	return compose(
		withUserQuery,
	)(ChildComponent);
};
