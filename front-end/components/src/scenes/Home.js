import React from 'react'
import { Form, Field } from 'react-final-form'
import { Row, Col, Button } from 'antd'
import AdapterText from '../components/Form/AdapterText'
import validators from '../utils/validators'

const Home = () => {

	const handleSubmit = () => {
		console.log('submit');
	}

	const initialValues = {
		defaultValue: 123
	}

	return (
		<div>
			<h1>Home</h1>
			<Form
				validate={values => ({
					passwordConfirm: validators.passwordConfirm(values)
				})}
				onSubmit={handleSubmit}
				initialValues={initialValues}
				render={({ handleSubmit, pristine, invalid, values }) => (
					<form onSubmit={handleSubmit}>
						<Row gutter={16}>
							<Col md={8}>
								<Field
									component={AdapterText}
									name="email"
									placeholder="Email"
									label="Email"
								/>
								<Field
									component={AdapterText}
									name="password"
									placeholder="Пароль"
									label="Новый пароль"
									type="password"
									validate={validators.compose(
										validators.required,
										validators.passwordLength,
										validators.passwordMatch,
									)}
								/>
								<Field
									component={AdapterText}
									name="passwordConfirm"
									placeholder="Подтверждение пароля"
									label="Повторите пароль"
									type="password"
									validate={validators.compose(
										validators.required,
									)}
								/>
							</Col>
						</Row>
						<Button type="primary" htmlType="submit" disabled={pristine || invalid}>Submit</Button>
						<br /><br /><pre>{JSON.stringify(values, 0, 2)}</pre>
					</form>
				)}
			/>
		</div>
	)
};

export default Home
