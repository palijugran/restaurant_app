const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Order'
    },
    transaction_id: {
        type: String
    },
    receipt_url: {
        type: String
    }

}, { timestamps: true });

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;