const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, "Field missing"] },
    order_items: [
        {
            type: new mongoose.Schema({
                dish_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: [true, "Field missing"] },
                quantity: Number
            })
        }
    ],
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'preparing', 'packed', 'delivered'], default: 'pending', required: true },
    payment: { type: Boolean, default: false },
    address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User.addressBook', required: [true, "Field missing"] },
    feedback: { type: String }

}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;