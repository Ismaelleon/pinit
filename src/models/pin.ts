import mongoose from 'mongoose';

const pinSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: {
        url: String,
        public_id: String,
    },
    url: String,
    author: String,
    board: {
        type: String,
        required: true,
    },
    comments: {
        type: [
            {
                content: String,
                author: String,
                date: String,
                likes: [String],
                _id: mongoose.Schema.Types.ObjectId,
            },
        ],
        default: [],
    },
});

const pin = mongoose.model('pin', pinSchema, 'pins');

export default pin;
