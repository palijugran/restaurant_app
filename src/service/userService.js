const { ObjectId } = require('bson');
const User = require('../model/User');

//address operations
exports.createAddress = async (user_id, data) => await User.updateOne(
    { _id: new ObjectId(user_id) },
    { $addToSet: { addressBook: data } }
)
exports.checkExistingAddress = async address => await User.findOne({ "addressBook.address": address })

exports.deleteAddress = async (user_id, address_id) => await User.updateOne({ _id: user_id }, { "$pull": { "addressBook": { _id: address_id } } });

exports.findAddress = async (user_id, address_id) => await User.findOne({ '_id': user_id, "addressBook._id": address_id })

exports.findAllAddresses = async user_id => await User.findById(user_id, 'addressBook')

//user 
exports.findUser = async user_id => await User.findById(user_id, '_id username email phoneNumber addressBook ')

//cart 
exports.addOrRemoveDishToCart = async (data, user_id) => {
    let updateCartDetails = await User.findById(user_id)
    let flag = 0
    updateCartDetails.cart_items.forEach(async (cartItem) => {
        //console.log("in for each")
        if (data.dish_id == cartItem.dish_id) {
            // console.log('updating old entry')
            cartItem.quantity = data.quantity
            flag = 1
        }
    });
    if (flag === 0) {
        // console.log("new entry")
        await User.findOneAndUpdate({ _id: user_id }, { $addToSet: { cart_items: data } })
    }
    updateCartDetails.save()
    return updateCartDetails
}
exports.viewCart = async user_id => await User.findById(user_id, 'cart_items').populate({ path: 'cart_items.dish_id' });
exports.clearCart = async user_id => await User.updateOne(
    { _id: new ObjectId(user_id) },
    { $pull: { 'cart_items': {} } }
)
exports.findDishInCart = async (user_id, dish_id) => await User.findOne({ _id: user_id, 'cart_items.dish_id': dish_id })
exports.deleteCartItem = async dish_id => await User.updateOne(
    { 'cart_items.dish_id': dish_id },
    { $pull: { 'cart_items': { dish_id } } }
)