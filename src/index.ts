import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './routes/index';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
	secure: true,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

const app: Application = express();
const port = process.env.PORT || 8080;

// middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api', router);

app.listen(port, () => {
	console.log(`app running on port ${port}`);
});
