const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const responder = require('../utils/responder');
const throwError = require('../utils/createError');
const orderService = require('../service/orderService');
const userService = require('../service/userService');
const transactionService = require('../service/transactionService');

exports.getCheckoutSession = async (request, response, next) => {
    try {
        const user_id = request.userInfo.userId
        //step 1: get order being placed
        const findOrder = await orderService.findOrderOfUser(request.params.order_id, request.userInfo.userId)
        if (!findOrder) {
            throw throwError(request, 404, {}, 500);
        }
        if (findOrder.payment === true) {
            throw throwError(request, 409, {}, 512)
        }
        //step 2: create checkout session
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            success_url: `${process.env.BASE_URL}/success`, //home page if payment successfull
            cancel_url: `${process.env.BASE_URL}/cancel`,//view page if payment cancel
            customer_email: request.userInfo.email,
            metadata: {
                "order_id": request.params.order_id,
                "user_id": user_id
            },
            line_items: [{
                price_data: {
                    unit_amount: `${findOrder.amount}` * 100,
                    currency: 'inr',
                    product_data: {
                        name: `orderId: ${findOrder._id}`
                    }
                },
                quantity: 1,
            }]
        })
        //step 3: send session as response

        return responder(response, true, 201, session.url)
    } catch (error) {
        console.log(error)
        next(error)
    }
}


exports.stripeWebhook = async (request, response, next) => {
    try {
        const event = request.body;
        let txnObject = {}, user_id, url

        // Handle the event
        switch (event.type) {
            case 'charge.succeeded': //reciept url
                console.log("charge succeeded")
                const chargeSucceeded = event.data.object
                url = chargeSucceeded.receipt_url
                await transactionService.updateURL(chargeSucceeded.payment_intent, chargeSucceeded.receipt_url);
                break;

            case 'checkout.session.completed': //meta data
                console.log('session completed')
                const sessionCompleted = event.data.object
                txnObject = {
                    order_id: sessionCompleted.metadata.order_id,
                    transaction_id: sessionCompleted.payment_intent,
                }
                user_id = sessionCompleted.metadata.user_id
                //checkoutCompletedAction
                await Promise.all([
                    userService.clearCart(user_id),
                    transactionService.updateTxnId(txnObject),
                    orderService.setPaymentToTrue(txnObject.order_id)
                ]).then(() => {
                    console.log("transaction table successfully updated")
                    //return responder(response, true, 511, {})
                }).catch((err) => {
                    console.log(err)
                    // throw throwError(request, 400, {}, 312)
                })
                break;

            default:
            //console.log(`Unhandled event type ${event.type}`);
        }
        response.send('true')
    }
    catch (err) {
        console.log(err)
        next(err)
    }
}