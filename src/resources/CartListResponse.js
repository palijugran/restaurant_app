const Resource = require('resources.js');


class Cart extends Resource {
    toArray() {
        return {
            id: this.dish_id._id,
            dish_name: this.dish_id.dish_name,
            price: this.dish_id.price,
            type: this.dish_id.type,
            quantity: this.quantity,
        }
    }
}

module.exports = Cart;