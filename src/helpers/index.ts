import jwt from "jsonwebtoken";
import User from '../models/user';

async function checkAuth (token: string) {
    if (token === undefined) {
        return {
            auth: false,
        }
    }

    let name = jwt.verify(
        token,
        process.env.JWT_SECRET!
    );

    let user = await User.findOne({ name });

    if (user === null) {
        return {
            auth: false,
        }
    }

    return {
        auth: true,
        user,
    };
}

export {
    checkAuth,
};
