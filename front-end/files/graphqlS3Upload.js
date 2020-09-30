import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

/**
 * graphql обработчик для загрузки файла
 * @param mutationName - название мутации
 * @param handlerName - название обработчика
 * @param refetchQueries
 * @returns {*}
 *
 * const withMutationUploadAvatar = graphqlS3Upload({
 * 	mutationName: 's3UploadDisciplineAvatar',
 * 	handlerName: 'handleS3UploadAvatar'
 * });
 *
 */
const graphqlS3Upload = ({ mutationName, handlerName, refetchQueries = [] }) => {

	const UPLOAD = gql`
       mutation ${mutationName}($file: Upload!, $params: String) {
       	${mutationName}(file: $file, params: $params) {
				 _id
				 filename
				 mimetype
				 url
           }
       }
	`;

	return graphql(UPLOAD, {
		props: ({ mutate }) => ({
			[handlerName]: (file, onSuccess, onError, additional) => {

				const params = additional ? JSON.stringify(additional) : undefined;

				mutate({
					variables: { file, params },
					refetchQueries,
					update: (store, { data: { [mutationName]: response } } ) => {
						onSuccess(response);
					},
				}).catch(() => {
					onError();
				})
			},
		}),
	});

};

export default graphqlS3Upload
