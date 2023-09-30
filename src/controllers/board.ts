import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/user";
import Pin from "../models/pin";

async function newBoard(req: Request, res: Response) {
	try {
		const name = jwt.verify(req.cookies.token, process.env.JWT_SECRET!);
		const user = await User.findOne({ name });

		if (user === null) {
			return res.sendStatus(401).end();
		}

		let boardName = req.body.name;

        if (boardName.length < 4) {
            return res.sendStatus(400).end();     
        }

		user.boards.push({ name: boardName, pins: [], author: user.name });
		await user.save();

		return res.sendStatus(200).end();
	} catch (err) {
		console.log(err);
	}
}

interface Board {
    name: string;
    pins: Array<any>;
    _id: string;
}

async function getBoard(req: Request, res: Response) {
    try {
        const name = jwt.verify(req.cookies.token, process.env.JWT_SECRET!);
        let user = await User.findOne({ name });

        if (user === null) {
            return res.sendStatus(401).end();
        }

        let { id } = req.params;
        let board: Board = {
            name: '',
            pins: [],
            _id: '',
        };
        const users = await User.find({});

        for (let user of users) {
            for (let i = 0; i < user.boards.length; i++) {
                if (user.boards[i]._id.toString() === id) {
                    board = user.boards[i];
                }
            }
        }

        for (let i = 0; i < board.pins.length; i++) {
            const pin = await Pin.findOne({ _id: board.pins[i] });    

            board.pins[i] = pin;
        }

        board.pins.reverse();

        return res.json(board).end();
    } catch (err) {
        console.log(err);
    }
}

async function deleteBoard (req: Request, res: Response) {
    try {
		const name = jwt.verify(req.cookies.token, process.env.JWT_SECRET!);
        const user = await User.findOne({ name });
        const { id } = req.params;

        if (user === null) {
			return res.sendStatus(401).end();
        }

        let board = user.boards.filter((board: Board) => board._id.toString() === id);
        await Pin.deleteMany({ board: board[0].name });
        
        user.boards = user.boards.filter((board: Board) => board._id.toString() !== id);

        await user.save();
        
        return res.end(); 
    } catch (err) {
        console.log(err);
    }
}

export { newBoard, getBoard, deleteBoard };
