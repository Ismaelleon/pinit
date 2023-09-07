import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express";
import User from "../models/user";
import Pin from '../models/pin';

async function newPin(req: Request, res: Response) {
	try {
		let email = jwt.verify(
			req.cookies.token,
			process.env.JWT_SECRET!
		);

		let user = await User.findOne({ email });

		if (user === null) {
			return res.sendStatus(401).end();
		}

		const { title, content, url, board } = req.body;
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

		let newPin = new Pin({
			title,
			content,
			url,
			image: {
				url: result.secure_url,
				public_id: result.public_id,
			},
			board,
			author: user.name,
		});

		await newPin.save();

		return res.json({ id: newPin._id }).end();
	} catch (err) {
		console.log(err);
	}
}

async function getPin(req: Request, res: Response) {
	try {
		const { id } = req.params;

		const pin = await Pin.findOne({ _id: id });

		if (pin === null) {
			res.sendStatus(404).end();
		}

		return res.json(pin).end();
	} catch (err) {
		console.log(err);
	}
}

export { newPin, getPin };
