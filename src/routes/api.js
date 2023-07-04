const Router = require('express').Router();
const express = require('express')
const upload = require('../utils/uploadFile');
const authJWT = require('../middleware/authJwt');
const isAdmin = require('../middleware/isAdmin');
const ratingValidator = require('../middleware/ratingValidator');
const validation = require('../middleware/passwordValidator');
const authController = require('../controller/authController');
const userController = require('../controller/userController');
const menuController = require('../controller/menuController');
const orderController = require('../controller/orderController');
const transactionController = require('../controller/transactionController');

//auth routes 
Router.post('/register', validation.authValid, validation.validator, authController.register);
Router.post('/login', authController.login);
Router.get('/refreshToken', authController.refreshToken);

//admin routes
Router.post('/addDishesToMenu', authJWT, isAdmin, upload.single('thumbnail'), menuController.addDishes);
Router.delete('/removeDishesFromMenu/:dish_id', authJWT, isAdmin, menuController.removeDish);
Router.patch('/updateOrderStatus/:order_id', authJWT, isAdmin, orderController.updateOrderStatus);

//user routes
Router.post('/addUserAddress', authJWT, userController.addAddress);
Router.delete('/removeUserAddress/:address_id', authJWT, userController.removeAddress);
Router.get('/getAllAddress', authJWT, userController.getAllAddress);
Router.get('/getUserProfile', authJWT, userController.userProfile);
Router.patch('/addOrUpdateItemToCart/:dish_id', authJWT, userController.addOrUpdateItemToCart); //adding a new dish => replaces old document
Router.get('/getCartSummary', authJWT, userController.getCartSummary);

//menu routes
Router.get('/getCompleteMenu', authJWT, menuController.completeMenu);
Router.get('/getCategories', authJWT, menuController.getCategories);
Router.get('/getMenuByCategory', authJWT, menuController.getMenuByCategory);
Router.patch('/addOrUpdateRatingToDish/:dish_id', authJWT, ratingValidator, menuController.addOrUpdateRating); //adding a new rating => replaces old doc

//order routes
Router.get('/orderHistory', authJWT, orderController.orderHistory);
Router.get('/getCompleteOrder/:order_id', authJWT, orderController.completeOrderByOrderId);
Router.post('/addFeedBackForAnOrder/:order_id', authJWT, orderController.addfeedback);
Router.post('/placeOrder', authJWT, orderController.placeOrder);
Router.post('/repeatOrder/:order_id', authJWT, orderController.repeatOrder);

//transaction routes
Router.get('/checkoutSession/:order_id', authJWT, transactionController.getCheckoutSession);
Router.post('/webhook', express.raw({ type: 'application/json' }), transactionController.stripeWebhook);




Router.use('/success', (request, response) => {
    response.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Thanks for your order!</title>
    </head>
    <body>
        <section>
            <h2> Order placed Successfully!!</h2>
            <p>
                Your order will reach to you soon!
            </p>
        </section>
    </body>
    </html>`)
})

Router.use('/cancel', (request, response) => {
    response.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Checkout canceled</title>
    </head>

    <body>
        <section>
            <h2>Payment cancelled</h2>
            <p>Forgot to add something to your cart? Add more and then come back to pay!</p>
        </section>
    </body>
    </html>`)
})
module.exports = Router;

