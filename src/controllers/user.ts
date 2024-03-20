import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/user';

async function getUser(req: Request, res: Response) {
    try {
        let name = req.query.name;

        if (name === undefined) {
            if (req.cookies.token === undefined) {
                return res.sendStatus(401).end();
            }

            let payload: string | JwtPayload = jwt.verify(
                req.cookies.token,
                process.env.JWT_SECRET!,
            );

            //@ts-ignore
            name = payload;
        }

        const user = await User.findOne({ name }).select(
            'name boards verified',
        );

        if (user === null) {
            return res.sendStatus(401).end();
        }

        return res.json(user).end();
    } catch (err) {
        console.log(err);
    }
}

export { getUser };
