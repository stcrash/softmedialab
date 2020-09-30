require('dotenv').config();
import passport from 'passport'
import passportVkontakte from 'passport-vkontakte'
import { User } from '../mongo/models/User'

/**
 * Инициализация пользователей
 * @param app
 */
const initAuthVkontakte = (app) => {

	const { PASSPORT_VK_ID, PASSPORT_VK_SECRET, NODE_ENV, CLIENT_HOST, CLIENT_PORT, SERVER_PORT } = process.env;

	const serverHost = NODE_ENV === 'localhost' ? `${CLIENT_HOST}:${SERVER_PORT}` : CLIENT_HOST;
	const clientHost = NODE_ENV === 'localhost' ? `${CLIENT_HOST}:${CLIENT_PORT}` : CLIENT_HOST;

	const loginUrl = '/auth/vkontakte';
	const callbackUrl = '/auth/vkontakte/callback';

	/**
	 Стратегия описывает авторизацию пользователя через вконтакте
	 https://vk.com/dev/objects/user
	 */
	passport.use(new passportVkontakte.Strategy({
			apiVersion: '5.92',
			clientID: PASSPORT_VK_ID,
			clientSecret: PASSPORT_VK_SECRET,
			callbackURL: serverHost + callbackUrl,
			profileFields: ['crop_photo']
		},
		async (accessToken, refreshToken, params, profile, done) => {

			// Авторизация в вк прошла успешно
			const {
				id: userId,
				profileUrl: url,
				gender,
				_json: {
					first_name: name,
					last_name: surname,
					crop_photo
				},
			} = profile;

			const avatar = crop_photo
				? crop_photo.photo.sizes.find(v => v.type === 'x').url
				: null;

			const data = {
				lastLoginAt: new Date().toISOString(),
				provider: {
					vkontakte: {
						userId,
						accessToken,
						name,
						surname,
						url,
						gender,
						avatar
					}
				},
				roles: [
					{ group: 'user', permissions: ['default'] },
					{ group: 'learner', permissions: ['default'] },
				]
			};

			// Ищем пользователя по userId
			let user = await User.getByVkontakteUserId({ userId });

			// Если пользователь найден, обновляем данные, иначе создаем нового
			if (user)
				User.change({ _id: user._id, ...data });

			// Создание пользователя
			else
			{
				// Обновляем профиль только при первой регистрации
				data.profile = { name, surname };

				if (avatar)
					data.profile.avatar = {
						url: avatar
					};

				user = await User.add(data);
			}

			return done(null, user);

		}
	));

	/**
	 * Редирект на vk для предоставления прав
	 */
	app.get(loginUrl, passport.authenticate('vkontakte', { session: false }) );

	/**
	 * Возврат с vk в случае успеха или провала
	 */
	app.get(callbackUrl, (req, res, next) => {
		passport.authenticate('vkontakte', { session: false }, async (err, user) => {

			let redirectUrl = '/sign-in';

			// Установка cookie с токеном пользователя на 31 день
			if (user)
			{
				const expires = new Date();
				expires.setDate(expires.getDate() + 31);
				req.universalCookies.set('userToken', await user.getToken(), { path: '/', expires });
				redirectUrl = '/user/account'
			}

			return res.redirect(clientHost + redirectUrl);

		})(req, res, next);
	});

};

export default initAuthVkontakte
