const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = Schema({
    type: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    addressBook: [
        {
            type: new mongoose.Schema({
                address: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                pincode: { type: Number, required: true },
            })
        }
    ],
    cart_items: [
        {
            type: new mongoose.Schema({
                dish_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: [true, "Field missing"] },
                quantity: Number
            })
        }
    ]

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;