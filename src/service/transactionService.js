const { ObjectId } = require('bson');
const Transaction = require('../model/Transaction');

exports.updateTxnId = async data => await Transaction.create(data)

exports.updateURL = async (txnId, url) => await Transaction.updateOne({ transaction_id: txnId }, { receipt_url: url })