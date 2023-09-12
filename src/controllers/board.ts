import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/user";

async function newBoard(req: Request, res: Response) {
	try {
		const name = jwt.verify(req.cookies.token, process.env.JWT_SECRET!);
		const user = await User.findOne({ name });

		if (user === null) {
			return res.sendStatus(401).end();
		}

		let boardName = req.body.name;

		user.boards.push({ name: boardName, pins: [] });
		await user.save();

		return res.sendStatus(200).end();
	} catch (err) {
		console.log(err);
	}
}

export { newBoard };
