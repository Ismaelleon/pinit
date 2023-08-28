import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/user";

async function getUser(req: Request, res: Response) {
	try {
		const email = jwt.verify(req.cookies.token, process.env.JWT_SECRET!);
		const user = await User.findOne({ email }).select("boards pins");

		if (user === null) {
			return res.sendStatus(401).end();
		}

		return res.json(user).end();
	} catch (err) {
		console.log(err);
	}
}

export { getUser };
