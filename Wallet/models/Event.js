const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
},
    {
    versionKey: false,
    timestamps: true
    }
);

const Event    = mongoose.model('Event', userSchema);
module.exports = Event 