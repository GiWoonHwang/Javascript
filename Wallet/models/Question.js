const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true, //  스페이스를 없애주는 역할을 함
        required: true
    },
    nickname: {
        type: String,
    },
    phone: {
        type: String,
    },

    subject: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    answer: {
        type: String
    },
    status: {
        type: Number,
        default: 0
    },
},
    {
    versionKey: false,
    timestamps: true
    }
);

const Question = mongoose.model('Question', userSchema)
module.exports = Question 