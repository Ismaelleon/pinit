import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema: mongoose.Schema = new mongoose.Schema({
	email: String,
	password: String,
	birthday: String,
	boards: [String],
	pins: [
		{
			title: String,
			content: String,
			image: {
				url: String,
				public_id: String,
			},
			url: String,
			board: String,
		},
	],
});

userSchema.pre("save", async function (next) {
	try {
		let hashedPassword = await bcrypt.hash(this.password, 10);

		this.password = hashedPassword;
		next();
	} catch (err) {
		console.log(err);
	}
});

const User = mongoose.model("user", userSchema, "users");

export default User;
