import mongoose from 'mongoose';

const tokenSchema: mongoose.Schema = new mongoose.Schema({
	userID: mongoose.Schema.ObjectId,
	token: String,
});

tokenSchema.index({ createdAt: 1 }, { expires: '1d' });

const Token = mongoose.model('token', tokenSchema, 'tokens');

export default Token;
