const Resource = require('resources.js');

class OrderDetails extends Resource {
    toArray() {
        return this.dish_name
    }
}

class Order extends Resource {
    toArray() {
        let order_date = new Date(this.createdAt).toLocaleString();
        return {
            id: this._id,
            amount_paid: this.amount,
            order_placed_on: order_date,
            order_items: OrderDetails.collection(this.order_details)
        }
    }
}

module.exports = Order;