import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema: mongoose.Schema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	birthday: String,
	activationKey: {
		type: String,
		required: true,
	},
	activated: {
		type: Boolean,
		default: false,
	},
	boards: [
		{
			name: String,
			pins: [String],
		}
	]
});

userSchema.pre('save', async function (next) {
	try {
		const hashedPassword = await bcrypt.hash(this.password, 10);

		this.password = hashedPassword;
		next();
	} catch (err) {
		console.log(err);
	}
});

const User = mongoose.model('user', userSchema, 'users');

export default User;
