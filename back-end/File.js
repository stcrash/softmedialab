import mongoose from 'mongoose'
import db from '../db'
import { handleErrors } from '../util/handleErrors'
import { mimetypes } from '../../util/mimetypes'
import _ from 'lodash'

const Schema = mongoose.Schema;

// Общая схема полей для файла Amazon S3
const FileSchema = new Schema({
	ownerId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	filename: {
		type: String,
		required: true,
		trim: true
	},
	url: {
		type: String,
		required: true,
		trim: true,
	},
	mimetype: {
		type: String,
		required: true,
		enum: [
			...mimetypes.image,
			...mimetypes.svg,
			...mimetypes.pdf,
			...mimetypes.txt,
			...mimetypes.word,
			...mimetypes.excel,
		],
	},
	s3: {
		Bucket: {
			type: String,
			required: true,
			trim: true,
		},
		Key: {
			type: String,
			required: true,
			trim: true,
		},
		ETag: {
			type: String,
			required: true,
			trim: true,
		},
		Location: {
			type: String,
			required: true,
			trim: true,
		},
	}
}, {
	collection: 'files',
	timestamps: {
		createdAt: 'createdAt',
	},
});

// Уникальный индекс. Адрес страницы должен быть уникальным в пределах статуса
FileSchema.index({ url: 1 }, { unique: true });

// FileSchema.post('updateOne', handleErrors);
FileSchema.post('save', handleErrors);

// Статичные методы на уровне коллекции
FileSchema.statics = {

	// Набор полей, доступных по умолчанию всем
	allowedFields: '_id ownerId filename mimetype url s3.Bucket s3.Key s3.ETag s3.Location',

	// Валидация id
	isValidId: id => mongoose.Types.ObjectId.isValid(id),

	// Поиск по id
	getById: function ({ _id, fields }) {
		return ! this.isValidId(_id) ? null :
			this.findOne({ _id })
				.select(fields || this.allowedFields)
				.exec();
	},

	// Поиск по списку id
	listByIds: function ({ ids, fields }) {
		if ( ! ids) return [];

		ids = ids.filter(_id => this.isValidId(_id));

		if ( ! ids.length) return [];

		const query = this.find({ _id: {$in: ids} });

		return query
			.select(fields || this.allowedFields)
			.sort({ createdAt: 1 })
			.exec();
	},

	// Создание
	add: async function (data) {
		const file = await this.create(data);
		return _.pick(file, this.allowedFields.split(' '));
	},

	// Удаление
	remove: async function ({ _id }) {
		const res = await this.deleteOne({ _id }).exec();
		return !! ( res && res.ok && res.n );
	}

};

export const File = db.model('File', FileSchema);
