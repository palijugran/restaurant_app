const { ObjectId } = require('bson')
const Order = require('../model/Order')

exports.findOrdersByUserId = async user_id => {
    return await Order.aggregate([
        { $match: { user_id: new ObjectId(user_id), payment: true } },
        { $lookup: { from: "menus", localField: "order_items.dish_id", foreignField: "_id", as: "order_details" } }
    ])
}
exports.findOrderByOrderId = async order_id => {
    return await Order.aggregate([
        { $match: { _id: new ObjectId(order_id), payment: true } },
        { $lookup: { from: "menus", localField: "order_items.dish_id", foreignField: "_id", as: "order_details" } },
        { $lookup: { from: "users", localField: "addressBook._id", foreignField: "address_id", as: "address_details" } },
        { $lookup: { from: "transactions", localField: "_id", foreignField: "order_id", as: "transaction_details" } },
        //{ $unwind: '$address_details' },
        {
            $project: {
                "address_details._id": 0,
                "address_details.username": 0,
                "address_details.email": 0,
                "address_details.password": 0,
                "address_details.phoneNumber": 0,
                "address_details.orders": 0,
                "address_details.createdAt": 0,
                "address_details.updatedAt": 0,
                "address_details.__v": 0,
                "address_details.cart_items": 0,
            }
        }
    ])
}
exports.findOrder = async order_id => await Order.findById(order_id)
exports.findOrderOfUser = async (order_id, userId) => await Order.findOne({ _id: order_id, user_id: userId })

exports.updateOrderStatus = async (order_id, status) => await Order.updateOne(
    { "_id": order_id },
    { $set: { status: status } }
)

exports.addFeedbackToOrder = async (order_id, feedback) => await Order.updateOne(
    { "_id": order_id },
    { $set: { 'feedback': feedback } }
)

exports.addOrder = async (data) => await Order.create(data)

exports.setPaymentToTrue = async order_id => await Order.findOneAndUpdate(
    { _id: order_id },
    { $set: { payment: true } }
)
