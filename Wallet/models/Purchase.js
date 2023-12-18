const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    status: {
        type: Number,
    },
    value: {
        type: Number,
    },
    amount: {
        type: Number,
        default: 1,
    },
    to: {
        type: String,
        default:null
    },
    nickname: {
      type: String,
    },
    phone: {
      type: String,
    },
    balance: {
      type: Number,
    },
    sortation: {
    type: String,
    }


},
    {
    versionKey: false,
    timestamps: true
    }
);

const Purchase = mongoose.model('Purchase', userSchema);
module.exports = Purchase;