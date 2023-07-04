const Resource = require('resources.js');


class OrderDetails extends Resource {
    toArray() {
        return {
            dish_name: this.dish_name,
            description: this.description,
            price: this.price,
            quantity: this.qty,
            thumbnail: this.thumbnail ? this.thumbnail : false,
            type: this.type
        }
    }
}

class Order extends Resource {
    toArray() {
        let order_date = new Date(this.updatedAt).toLocaleString();
        let txn = findTransaction(this.transaction_details, this._id)
        return {
            id: this._id,
            status: this.status,
            amount_paid: this.amount,
            transaction_id: txn.requiredTxnId,
            reciept: txn.reciept,
            order_placed_on: order_date,
            delivery_address: findAddress(this.address_details, this.address_id),
            order_items: OrderDetails.collection(addQuantity(this.order_items, this.order_details)),
            feedback: this.feedback
        }
    }
}

function addQuantity(order_items, order_details) {
    let finalArr = []
    order_details.map((OuterValue) => {
        order_items.map((InnerValue) => {
            if (OuterValue._id.equals(InnerValue.dish_id)) {
                OuterValue["qty"] = InnerValue.quantity
            }
        })
        finalArr.push(OuterValue)
    })
    return finalArr
}

function findAddress(address_details, recievedAddressId) {
    let finalAddress = {}
    let finalArr = []
    address_details.map((value) => {
        value.addressBook.map((innerValue) => {
            if (innerValue._id.equals(recievedAddressId)) {
                finalAddress = innerValue
            }
        })
    })
    for (x in finalAddress) {
        if (x !== '_id')
            finalArr.push(finalAddress[x])
    }
    return finalArr.join(', ')
}

function findTransaction(txnArr, orderId) {
    let requiredTxnId, reciept
    txnArr.map((transaction) => {
        if (transaction.order_id = orderId) {
            requiredTxnId = transaction.transaction_id
            reciept = transaction?.receipt_url
        }
    })
    return { requiredTxnId, reciept }
}

module.exports = Order;