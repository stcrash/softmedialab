const compose = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined);

const required = value => (value || value === 0 || value === false ? undefined : 'Обязательное поле');

const number = value => (value && isNaN(value) ? 'Должно быть числом' : undefined);

const min = min => value => isNaN(value) || value >= min ? undefined : `Должно быть не меньше ${min}`;

const max = max => value => isNaN(value) || value <= max ? undefined : `Должно быть не больше ${max}`;

const url = value => (/^[a-z0-9-]+$/.test(value) ? undefined : 'Должно содержать символы: a-z, 0-9, -');

const passwordConfirm = ({ password, passwordConfirm }) => ! password || password === passwordConfirm ? undefined : 'Пароли не совпадают';
const passwordLength = password => ! password || password.length >= 6 ? undefined : 'Пароль должен быть не менее 6 символов';
const passwordMatch = password => ! /\s/.test(password) ? undefined : 'Пароль не должен содержать пробелы';

export default {
	compose,
	required,
	number,
	min,
	max,
	url,
	passwordConfirm,
	passwordLength,
	passwordMatch,
}
