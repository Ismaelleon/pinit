import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user";

async function signUp(req: Request, res: Response) {
	try {
		const { email, password, date } = req.body;

		const user = await User.findOne({ email });

		if (user !== null) {
			return res.status(409).end();
		}

		const newUser = new User({
			email,
			password,
			date,
		});

		await newUser.save();

		let token = jwt.sign(email, process.env.JWT_SECRET!);

		return res.cookie("token", token).end();
	} catch (err) {
		console.log(err);
	}
}

async function logIn(req: Request, res: Response) {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (user === null) {
			return res.sendStatus(401).end();
		}

		const passwordMatches = await bcrypt.compare(password, user.password);

		if (passwordMatches) {
			let token = jwt.sign(email, process.env.JWT_SECRET!);
			return res.cookie("token", token).end();
		}

		return res.sendStatus(401).end();
	} catch (err) {
		console.log(err);
	}
}

export { signUp, logIn };
