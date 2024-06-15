import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Token from '../models/token';

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

        const activationKey = crypto.randomBytes(16).toString('hex');

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
            from: 'mail@pinit.com', to: email,
            subject: 'Activate your account',
            text: '',
            html: `
				<div style="display: flex; flex-direction: column; align-items: center;">
					<h1 style="font-size: 24px; font-family: "ui-sans-serif, system-ui"">PinIt</h1>
					<a 
						href="http://${process.env.DOMAIN}/activate/${activationKey}"
						style="
							padding: 10px;
							background-color: rgb(220, 38, 38);
							color: #fff;
							border-radius: 5px;
							text-decoration: none;
							font-family: 'Arial';
							font-size: 16px;

						"
					>
						Activate your account
					</a>
				</div>
			`,
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

async function activate(req: Request, res: Response) {
    try {
        const { activation_key: activationKey } = req.params;

        const user = await User.findOne({ activationKey });

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

async function sendPasswordResetMail (req: Request, res: Response) {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });

		// If user not found, send 404 Not Found status code
		if (!user) {
			return res.sendStatus(404);
		}

        const transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

		// Create temporary token for password reset
        const tokenValue = crypto.randomBytes(16).toString('hex');
		const token = new Token({
			userID: user._id,
			token: tokenValue,
		});

		await token.save();

        await transporter.sendMail({
            from: 'mail@pinit.com',
            to: email,
            subject: 'Reset your password',
            text: '',
            html: `
				<a style="font-size: .875rem; font-family: ui-sans-serif, Roboto; padding: 0.5rem; font-weight: 600; border-radius: .25rem; border: none; background-color: rgb(220 38 38); color: #fff; text-decoration: none;" href="${process.env.APP_URL}/reset-password?token=${tokenValue}">
					Activate your account
				</a>
			`,
        });

		return res.end();
	} catch (err) {
		console.log(err);
	}
}

async function setPassword (req: Request, res: Response) {
	try {
		const { password, token: tokenValue } = req.body;
		const token = await Token.findOne({ token: tokenValue });

		// If token not found, send 498 Invalid Token status code
		if (!token) {
			return res.sendStatus(498);
		}

		const user = await User.findOne({ _id: token.userID });

		// If user not found, send 404 Not Found status code
		if (!user) {
			return res.sendStatus(404);
		}

		// Set user password and save
		user.password = password;
		await user.save();
		
		// Send 200 Ok status code
		return res.sendStatus(200);
	} catch (err) {
		console.log(err);
	}
}

export { signUp, logIn, activate, sendPasswordResetMail, setPassword };
