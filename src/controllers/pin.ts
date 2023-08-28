import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express";
import User from "../models/user";

async function newPin(req: Request, res: Response) {
	try {
		let email = await jwt.verify(
			req.cookies.token,
			process.env.JWT_SECRET!
		);

		let user = await User.findOne({ email });

		if (user === null) {
			return res.sendStatus(401).end();
		}

		const { title, content, url, board } = req.body;
		const _id = new mongoose.Types.ObjectId();
		const imageFileName = req.file?.filename;
		const options = {
			overwrite: true,
			public_id: imageFileName,
			folder: "pinit",
		};

		const result = await cloudinary.uploader.upload(
			path.join(__dirname, "../public/images", imageFileName!),
			options
		);

		user.pins.push({
			title,
			content,
			url,
			image: {
				url: result.secure_url,
				public_id: result.public_id,
			},
			board,
			_id,
		});

		await user.save();

		return res.json({ id: _id }).end();
	} catch (err) {
		console.log(err);
	}
}

async function getPin(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const users = await User.find({});
		let pins: any = [];

		for (let user of users) {
			for (let pin of user.pins) {
				pins.push(pin);
			}
		}

		pins = pins.filter((pin: any) => {
			return pin._id.toString() === id;
		});

		if (pins.length === 0) {
			return res.sendStatus(404).end();
		}

		return res.json(pins[0]).end();
	} catch (err) {
		console.log(err);
	}
}

export { newPin, getPin };
