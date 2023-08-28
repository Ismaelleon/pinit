import express, { Router } from "express";
import path from "path";
import mongoose from "mongoose";
import multer from "multer";
import { signUp, logIn } from "../controllers/auth";
import { newPin, getPin } from "../controllers/pin";
import { newBoard } from "../controllers/board";
import { getUser } from "../controllers/user";

// Connect to database
let uri = process.env.DATABASE_URI || "mongodb://127.0.0.1/pinit";
mongoose.connect(uri);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "../public/images"));
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});

const upload = multer({ storage });

const router: Router = express.Router();

router.post("/sign-up", signUp);
router.post("/log-in", logIn);

router.post("/boards/new", newBoard);

router.post("/pin/new", upload.single("image"), newPin);
router.post("/pin/:id", getPin);

router.post("/user", getUser);

export default router;
