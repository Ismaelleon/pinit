import mongoose from 'mongoose';

const pinSchema = new mongoose.Schema({
	title: String,
	content: String,
	image: {
		url: String,
		public_id: String,
	},
	url: String,
	author: String,
    board: {
        type: String,
        required: true,
    },
});

const pin = mongoose.model('pin', pinSchema, 'pins');

export default pin;
