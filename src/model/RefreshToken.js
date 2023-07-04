const mongoose = require('mongoose');
const { Schema } = mongoose;


const RefreshTokenSchema = Schema({
    user_id: {
        type: Schema.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expires_in: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema)
module.exports = RefreshToken;