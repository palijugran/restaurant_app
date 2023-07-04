const Resource = require('resources.js');

function findAvgRating(ratingArr) {
    const arr = []
    ratingArr.map((value) => {
        arr.push(value.stars)
    })
    return arr.reduce((a, b) => a + b) / arr.length
}

class Menu extends Resource {
    toArray() {

        return {
            id: this._id,
            dish_name: this.dish_name,
            description: this.description,
            type: this.type,
            category: this.category,
            price: this.price,
            thumbnail: this.thumbnail ? this.thumbnail : false,
            rating: this.ratings.length === 0 ? null : findAvgRating(this.ratings)
        }
    }
}

module.exports = Menu;