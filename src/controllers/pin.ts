import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';
import Pin from '../models/pin';
import Jimp from 'jimp';
import { checkAuth } from '../helpers/index';

async function newPin(req: Request, res: Response) {
    try {
        const { auth, user } = await checkAuth(req.cookies.token);

        if (!auth) {
            return res.sendStatus(401).end();
        }

        const { title, content, url, boardName, date } = req.body;

        if (
            title.length < 4 ||
            boardName.length < 4 ||
            boardName === 'new-board'
        ) {
            return res.sendStatus(400).end();
        }

        const imageFileName = req.file?.filename;

        // Resize and compress image
        const image = await Jimp.read(
            path.join(__dirname, `../public/images/${imageFileName}`),
        );
        const imageWidth = image.getWidth();
        await image
            .resize(imageWidth / 2, Jimp.AUTO)
            .quality(70)
            .writeAsync(
                path.join(__dirname, `../public/images/${imageFileName}`),
            );

        const options = {
            overwrite: true,
            public_id: imageFileName,
            folder: 'pinit',
        };

        const result = await cloudinary.uploader.upload(
            path.join(__dirname, '../public/images', imageFileName!),
            options,
        );

		// Save image url with compression option
		result.secure_url = result.secure_url.replace('/upload', '/upload/q_auto:low');

        const pinId = new mongoose.mongo.ObjectId();
        const newPin = new Pin({
            title,
            content,
            url,
			date,
            image: {
                url: result.secure_url,
                public_id: result.public_id,
            },
            board: boardName,
            author: user!.name,
            _id: pinId,
        });

        await newPin.save();

        for (let i = 0; i < user!.boards.length; i++) {
            if (user!.boards[i].name === boardName) {
                if (user!.boards[i].pins.length === 0) {
                    user!.boards[i].thumbnail = result.secure_url;
                }

                user!.boards[i].pins.push(pinId.toString());
            }
        }

        await user!.save();

        return res.json({ id: newPin._id }).end();
    } catch (err) {
        console.log(err);
    }
}

async function getLatestPins(req: Request, res: Response) {
    try {
        const { auth } = await checkAuth(req.cookies.token);

        if (!auth) {
            return res.sendStatus(401).end();
        }

        const pins = await Pin.find({}).limit(20);

        pins.reverse();

        return res.json(pins).end();
    } catch (err) {
        console.log(err);
    }
}

async function getPin(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const pin = await Pin.findOne({ _id: new mongoose.Types.ObjectId(id) });

        if (pin === null) {
            return res.sendStatus(404).end();
        }

        return res.json(pin).end();
    } catch (err) {
        console.log(err);
    }
}

async function deletePin(req: Request, res: Response) {
    try {
        const { auth, user } = await checkAuth(req.cookies.token);

        if (!auth) {
            return res.sendStatus(401).end();
        }

        const { id } = req.params;
        const pin = await Pin.findOne({ _id: id });

        if (pin === null) {
            return res.sendStatus(404).end();
        }

        if (pin.author === user!.name) {
            await Pin.deleteOne({ _id: id });

            for (let i = 0; i < user!.boards.length; i++) {
                if (user!.boards[i].pins.includes(id)) {
                    for (let j = 0; j < user!.boards[i].pins.length; j++) {
                        if (user!.boards[i].pins[j] === id) {
                            user!.boards[i].pins.splice(j, 1);
                        }
                    }
                }
            }

            await user!.save();
        }

        return res.end();
    } catch (err) {
        console.log(err);
    }
}

async function commentPin(req: Request, res: Response) {
    try {
        const { auth } = await checkAuth(req.cookies.token);

        if (!auth) {
            return res.sendStatus(401).end();
        }

        const { id, content, author, date } = req.body;
        const pin = await Pin.findOne({ _id: new mongoose.Types.ObjectId(id) });

        if (pin === null) {
            return res.sendStatus(404).end();
        }

        pin.comments.push({
            content,
            author,
            date,
            likes: [],
			replies: [],
            _id: new mongoose.Types.ObjectId(),
        });

        await pin.save();

        return res.json(pin).end();
    } catch (err) {
        console.log(err);
    }
}

async function likeCommentPin(req: Request, res: Response) {
    try {
        const { auth, user } = await checkAuth(req.cookies.token);

        if (!auth) {
            return res.sendStatus(401).end();
        }

        const { pinId, _id } = req.body;
        const pin = await Pin.findOne({
            _id: new mongoose.Types.ObjectId(pinId),
        });

        if (pin === null) {
            return res.sendStatus(404).end();
        }

        let likedComment = {};

        pin.comments.map((comment) => {
            if (comment._id!.toString() === _id) {
                if (comment.likes.length > 0) {
                    comment.likes.map((like, index) => {
                        if (like === user!.name) {
                            comment.likes.splice(index, 1);
                        } else {
                            comment.likes.push(user!.name);
                        }
                    });
                } else {
                    comment.likes.push(user!.name);
                }

                likedComment = comment;
            }
        });

        await pin.save();

        return res.json(likedComment).end();
    } catch (err) {
        console.log(err);
    }
}

async function uncommentPin(req: Request, res: Response) {
    try {
        const { auth } = await checkAuth(req.cookies.token);

        if (!auth) {
            return res.sendStatus(401).end();
        }

        const { pinId, _id } = req.body;
        const pin = await Pin.findOne({
            _id: new mongoose.Types.ObjectId(pinId),
        });

        if (pin === null) {
            return res.sendStatus(404).end();
        }

        pin.comments = pin.comments.filter((comment) => {
            return comment._id!.toString() !== _id;
        });

        await pin.save();

        return res.json(pin).end();
    } catch (err) {
        console.log(err);
    }
}

export {
    newPin,
    getLatestPins,
    getPin,
    deletePin,
    commentPin,
    likeCommentPin,
    uncommentPin,
};
