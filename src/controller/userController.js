const userService = require('../service/userService');
const responder = require('../utils/responder');
const throwError = require('../utils/createError');
const menuService = require('../service/menuService');
const CartListResponse = require('../resources/CartListResponse');

//address handling
exports.addAddress = async (request, response, next) => {
    try {
        const user_id = request.userInfo.userId;
        const { address, city, state, pincode } = request.body
        const data = { address, city, state, pincode }
        const checkAddress = await userService.checkExistingAddress(data.address)

        if (checkAddress) {
            throw throwError(request, 409, {}, 310)
        }
        const addressCreated = await userService.createAddress(user_id, data)
        if (addressCreated.modifiedCount === 0) {
            throw throwError(request, 400, {}, 306)
        }
        return responder(response, true, 305, {})
    }
    catch (error) {
        console.log(error)
        next(error)
    }

}

exports.removeAddress = async (request, response, next) => {
    try {
        const user_id = request.userInfo.userId;
        const address_id = request.params.address_id
        const findAddress = await userService.findAddress(user_id, address_id)

        if (!findAddress) {
            throw throwError(request, 404, {}, 309)
        }
        const addressRemoved = await userService.deleteAddress(user_id, address_id)
        if (addressRemoved.modifiedCount === 0) {
            throw throwError(request, 400, {}, 308)
        }
        return responder(response, true, 307, {})
    }
    catch (error) {
        console.log(error)
        next(error)
    }
}

exports.getAllAddress = async (request, response, next) => {
    try {
        const user_id = request.userInfo.userId;
        const allAddresses = await userService.findAllAddresses(user_id);

        if (allAddresses.addressBook.length === 0) {
            throw throwError(request, 404, {}, 309)
        }
        responder(response, true, 201, allAddresses)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

//user Profile
exports.userProfile = async (request, response, next) => {
    try {
        const user_id = request.userInfo.userId;
        const userFound = await userService.findUser(user_id)
        if (!userFound) {
            throw throwError(request, 404, {}, 303)
        }
        return responder(response, true, 201, userFound)
    } catch (error) {
        console.log(error),
            next(error)
    }
}

exports.addOrUpdateItemToCart = async (request, response, next) => {
    try {
        const dish_id = request.params.dish_id
        const user_id = request.userInfo.userId
        const { quantity } = request.body
        const data = { dish_id, quantity }
        //checking if dish is in the menu or not
        const dishFound = await menuService.findDishById(dish_id)
        if (!dishFound) {
            throw throwError(request, 404, {}, 405)
        }
        const dishToCart = await userService.addOrRemoveDishToCart(data, user_id)
        //console.log("DISH TO CART: ", dishToCart)
        if (!dishToCart) {
            throw throwError(request, 400, {}, 506)
        }
        console.log(dishToCart.cart_items)
        //if quantity is zero remove the item from the cart
        dishToCart.cart_items.map(async (value) => {
            // console.log("VALUE: ", value)
            if (value.quantity === 0) {
                // console.log("deleting cart item")
                await userService.deleteCartItem(value.dish_id)
            }
        })

        return responder(response, true, 505, {})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.getCartSummary = async (request, response, next) => {
    try {
        const user_id = request.userInfo.userId
        const getCartItems = await userService.viewCart(user_id);
        console.log(getCartItems)
        if (getCartItems.cart_items.length === 0) {
            throw throwError(request, 404, {}, 311)
        }
        let sum = 0;
        getCartItems.cart_items.map((item) => {
            sum = sum + (item.dish_id.price * item.quantity)
        })

        return responder(response, true, 201, { total: getCartItems.cart_items.length, grand_total: sum, cart: CartListResponse.collection(getCartItems.cart_items) })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
