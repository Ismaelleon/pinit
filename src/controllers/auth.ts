import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

async function signUp(req: Request, res: Response) {
	try {
		const { name, email, password, date } = req.body;

		let user = await User.findOne({ email });

		if (user !== null) {
			return res.status(409).end();
		}

        user = await User.findOne({ name });

		if (user !== null) {
			return res.status(409).end();
		}

        let activationKey = crypto.randomBytes(16).toString('hex');

		const newUser = new User({
            name,
			email,
			password,
            URL,
			date,
            activationKey,
		});

		await newUser.save();

        const transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: 'mail@pinit.com',
            to: email,
            subject: 'Activate your account',
            text: '',
            html: `<a href="http://${process.env.DOMAIN}/activate/${activationKey}">Activate your account</button>`,
        });

		const token = jwt.sign(name, process.env.JWT_SECRET!);

		return res.cookie('token', token).end();
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

		if (!passwordMatches) {
            return res.sendStatus(401).end();
		}

        const token = jwt.sign(user.name, process.env.JWT_SECRET!);
        return res.cookie('token', token).end();
	} catch (err) {
		console.log(err);
	}
}

async function activate (req: Request, res: Response) {
    try {
        let { activation_key: activationKey } = req.params;

        let user = await User.findOne({ activationKey });

        if (user === null) {
            return res.status(404).end(); 
        }

        user.activated = true;
        await user.save();

        res.end();
    } catch (err) {
        console.log(err);
    }
}

export { signUp, logIn, activate };
