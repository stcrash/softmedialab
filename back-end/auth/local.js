require('dotenv').config();
import { User } from '../mongo/models/User'
import { sendMail } from '../email'
import settings from '../settings'

/**
 * Инициализация пользователей
 * @param app
 */
const initAuthLocal = (app) => {

	const { NODE_ENV, CLIENT_HOST, SERVER_PORT, CLIENT_PORT, SMTP_USER } = process.env;
	const serverHost = NODE_ENV === 'localhost' ? `${CLIENT_HOST}:${SERVER_PORT}` : CLIENT_HOST;
	const clientHost = NODE_ENV === 'localhost' ? `${CLIENT_HOST}:${CLIENT_PORT}` : CLIENT_HOST;

	/**
	 * Отправка письма со ссылкой подтверждения аккаунта
	 */
	app.post('/auth/local/verify', (req, res) => {

		const { verifyToken, email } = req.body.user.provider.local;

		if ( ! verifyToken || ! email)
			return res.status(403).send('Доступ запрещен');

		sendMail({
			from: `"«${settings.siteName}»" <${SMTP_USER}>`,
			to: email,
			subject: 'Подтверждение аккаунта',
			template: 'authLocalVerify',
			context: {
				general: {
					baseUrl: clientHost,
					imagesUrl: `${clientHost}/src/assets/img/email/`,
				},
				siteName: settings.siteName,
				link: `${serverHost}/auth/local/verify/${verifyToken}`
			},
		}, (err) => {
			if (err) return res.status(500).send(err);
			res.status(200).send()
		});

	});

	/**
	 * Подтверждение аккаунта
	 */
	app.get('/auth/local/verify/:verifyToken', async (req, res) => {

		const { verifyToken } = req.params;

		if ( ! verifyToken)
			return res.status(403).send('Доступ запрещен');

		// Поиск пользователя с токеном подтверждения email
		const user = await User.getByLocalVerifyToken({ verifyToken });

		if ( ! user)
			return res.redirect(clientHost);

		await User.change({
			_id: user._id,
			lastLoginAt: new Date().toISOString(),
			'provider.local.verifyToken': '',
			'provider.local.isVerified': true
		});

		// Установка cookie с токеном пользователя на 31 день
		const expires = new Date();
		expires.setDate(expires.getDate() + 31);
		req.universalCookies.set('userToken', await user.getToken(), { path: '/', expires });
		return res.redirect(`${clientHost}/user/account`);

	});

	/**
	 * Отправка письма со ссылкой восстановления пароля
	 */
	app.post('/auth/local/recovery', (req, res) => {

		const { recoveryToken, email } = req.body.user.provider.local;

		if ( ! recoveryToken || ! email)
			return res.status(403).send('Доступ запрещен');

		sendMail({
			from: `"«${settings.siteName}»" <${SMTP_USER}>`,
			to: email,
			subject: 'Восстановление пароля',
			template: 'authLocalRecovery',
			context: {
				general: {
					baseUrl: clientHost,
					imagesUrl: `${clientHost}/src/assets/img/email/`,
				},
				siteName: settings.siteName,
				link: `${clientHost}/reset-password/${recoveryToken}`
			}
		}, (err) => {
			if (err) return res.status(500).send(err);
			res.status(200).send()
		});

	});

};

export default initAuthLocal
