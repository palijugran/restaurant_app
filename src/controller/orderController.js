const orderService = require('../service/orderService');
const responder = require('../utils/responder');
const throwError = require('../utils/createError');
const userService = require('../service/userService');
const OrderListResponse = require('../resources/OrderResponse');
const CompleteOrderResponse = require('../resources/CompleteOrderResponse');


exports.orderHistory = async (request, response, next) => {
    try {
        const user_id = request.userInfo.userId;
        const ordersFound = await orderService.findOrdersByUserId(user_id)
        if (ordersFound.length === 0) {
            throw throwError(request, 404, {}, 500)
        }
        return responder(response, true, 201, { total: ordersFound.length, orders: OrderListResponse.collection(ordersFound) })
    } catch (error) {
        console.log(error),
            next(error)
    }
}

exports.completeOrderByOrderId = async (request, response, next) => {
    try {
        const order_id = request.params.order_id
        const findOrder = await orderService.findOrderByOrderId(order_id)

        if (findOrder.length === 0) {
            throw throwError(request, 404, {}, 500);
        }

        return responder(response, true, 201, CompleteOrderResponse.collection(findOrder))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.updateOrderStatus = async (request, response, next) => {
    try {
        const order_id = request.params.order_id
        const status = request.body.status
        const findOrder = await orderService.findOrder(order_id)
        if (!findOrder) {
            throw throwError(request, 404, {}, 500);
        }
        const updateStatus = await orderService.updateOrderStatus(order_id, status)
        if (updateStatus.modifiedCount === 0) {
            throw throwError(request, 400, {}, 501)
        }
        return responder(response, true, 502, {})
    }
    catch (error) {
        console.log(error)
        next(error)
    }
}

exports.addfeedback = async (request, response, next) => {
    try {
        const order_id = request.params.order_id
        const { feedback } = request.body
        const orderFound = await orderService.findOrderByOrderId(order_id)

        if (orderFound.length === 0) {
            throw throwError(request, 404, {}, 500);
        }

        const addFeedback = await orderService.addFeedbackToOrder(order_id, feedback)
        if (addFeedback.modifiedCount === 0) {
            throw throwError(request, 400, {}, 503)
        }
        return responder(response, true, 504, {})

    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.placeOrder = async (request, response, next) => {
    try {
        const user_id = request.userInfo.userId
        const { address_id } = request.body
        const findAddress = await userService.findAddress(user_id, address_id);
        if (!findAddress) {
            throw throwError(request, 404, {}, 309)
        }

        const cart = await userService.viewCart(user_id)
        if (cart.cart_items.length === 0) {
            throw throwError(request, 404, {}, 311)
        }
        const order_items = []

        cart.cart_items.map((items) => {
            order_items.push({ dish_id: items.dish_id._id, quantity: items.quantity })
        })

        let amount = 0;
        cart.cart_items.map((item) => {
            amount = amount + (item.dish_id.price * item.quantity)
        })

        const data = { user_id, address_id, order_items, amount }
        const createOrder = await orderService.addOrder(data, user_id)
        if (!createOrder) {
            throw throwError(request, 400, {}, 508)
        }

        return responder(response, true, 507, { order_id: createOrder._id })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.repeatOrder = async (request, response, next) => {
    const order_id = request.params.order_id
    const orderFound = await orderService.findOrderByOrderId(order_id);
    const promise = []
    console.log(orderFound)
    orderFound.map((order) => {
        order.order_items.map(async (value) => {
            promise.push(userService.addOrRemoveDishToCart(value, request.userInfo.userId))
        })
    })
    await Promise.all(promise)
        .then(() => {
            return responder(response, true, 510, {})
        })
        .catch((err) => {
            console.log(err)
            throw throwError(request, 400, {}, 506)
        })
}