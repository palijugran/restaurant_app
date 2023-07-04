const mongoose = require('mongoose');
const { Schema } = mongoose;

const MenuSchema = Schema({
    dish_name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Veg', 'Non-veg'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: String,
    ratings: [
        {
            type: new mongoose.Schema({
                stars: { type: Number, max: 5, min: 0 },
                user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, "Field missing"] },

            })
        }
    ]

}, { timestamps: true });

const Menu = mongoose.model('Menu', MenuSchema);
module.exports = Menu;