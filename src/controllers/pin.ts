import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express";
import User from "../models/user";
import Pin from '../models/pin';
import Jimp from "jimp";

async function newPin (req: Request, res: Response) {
	try {
		let name = jwt.verify(
			req.cookies.token,
			process.env.JWT_SECRET!
		);

		let user = await User.findOne({ name });

		if (user === null) {
			return res.sendStatus(401).end();
		}

		const { title, content, url, boardName } = req.body;

        if (title.length < 4 || boardName.length < 4 || boardName === 'new-board') {
            return res.sendStatus(400).end();
        }

		const imageFileName = req.file?.filename;
        
        // Resize and compress image
        let image = await Jimp.read(path.join(__dirname, `../public/images/${imageFileName}`));
        let imageWidth = image.getWidth();
        await image.resize(imageWidth / 2, Jimp.AUTO).quality(70).writeAsync(path.join(__dirname, `../public/images/${imageFileName}`));

		const options = {
			overwrite: true,
			public_id: imageFileName,
			folder: "pinit",
		};

		const result = await cloudinary.uploader.upload(
			path.join(__dirname, "../public/images", imageFileName!),
			options
		);

        let pinId = new mongoose.mongo.ObjectId();
		let newPin = new Pin({
			title,
			content,
			url,
			image: {
				url: result.secure_url,
				public_id: result.public_id,
			},
			board: boardName,
			author: user.name,
            _id: pinId,
		});

		await newPin.save();

        for (let i = 0; i < user.boards.length; i++) {
            if (user.boards[i].name === boardName) {
                if (user.boards[i].pins.length === 0) {
                    user.boards[i].thumbnail = result.secure_url;
                }

                user.boards[i].pins.push(pinId.toString());
            }
        }

        await user.save();

		return res.json({ id: newPin._id }).end();
	} catch (err) {
		console.log(err);
	}
}

async function getLatestPins (req: Request, res: Response) {
    try {
		let name = jwt.verify(
			req.cookies.token,
			process.env.JWT_SECRET!
		);

		let user = await User.findOne({ name });

		if (user === null) {
			return res.sendStatus(401).end();
		}

        const pins = await Pin.find({}).limit(20);

        pins.reverse();

        return res.json(pins).end();
    } catch (err) {
        console.log(err);
    }
}

async function getPin (req: Request, res: Response) {
	try {
		const { id } = req.params;

		const pin = await Pin.findOne({ _id: id });

		if (pin === null) {
			return res.sendStatus(404).end();
		}

		return res.json(pin).end();
	} catch (err) {
		console.log(err);
	}
}

async function deletePin (req: Request, res: Response) {
    try {
		let name = jwt.verify(
			req.cookies.token,
			process.env.JWT_SECRET!
		);

		let user = await User.findOne({ name });

		if (user === null) {
			return res.sendStatus(401).end();
		}

        let { id } = req.params;
        const pin = await Pin.findOne({ _id: id });

        if (pin === null) {
            return res.sendStatus(404).end();
        }

        if (pin.author === user.name) {
            await Pin.deleteOne({ _id: id });

            for (let i = 0; i < user.boards.length; i++) {
                if (user.boards[i].pins.includes(id)) {
                    for (let j = 0; j < user.boards[i].pins.length; j++) {
                        if (user.boards[i].pins[j] === id) {
                            user.boards[i].pins.splice(j, 1); 
                        }
                    }
                }
            }

            await user.save();
        }

        return res.end();
    } catch (err) {
        console.log(err);
    }
}

export { newPin, getLatestPins, getPin, deletePin };
