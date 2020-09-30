import React, { memo } from 'react'
import { Form, Input } from 'antd'
import diff from 'object-diff'

const FormItem = Form.Item;

const AdapterText = props => {
	const { input, meta, label, hasFeedback, ...rest } = props;
	return (
		<FormItem
			validateStatus={meta.error && meta.touched ? 'error' : ''}
			hasFeedback={typeof hasFeedback !== 'undefined' ? hasFeedback : true}
			help={meta.touched ? meta.error : ''}
			label={label}
		>
			<Input {...input} {...rest} />
		</FormItem>
	)
};

export default memo(AdapterText, (prevProps, nextProps) => ! (
	prevProps.input.value !== nextProps.input.value
	|| Object.keys( diff(prevProps.meta, nextProps.meta) ).length
));
