import express, { Application } from 'express';
import path from 'path';
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

// Serve index.html if client does not request a static file
app.use((req, res, next) => {
	if (req.method === 'GET') {
		if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
			next();
		} else {
			res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			res.header('Expires', '-1');
			res.header('Pragma', 'no-cache');
			res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
		}
	}

	next();
});

// middlewares
app.use(express.static(path.join(__dirname, 'client', 'dist')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api', router);

app.listen(port, () => {
    console.log(`app running on port ${port}`);
});
