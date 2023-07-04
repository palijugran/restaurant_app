const Menu = require('../model/Menu');

exports.addDish = async data => await Menu.create(data)

exports.findDishName = async dish_name => await Menu.findOne({ dish_name })

exports.findDishById = async dish_id => await Menu.findById(dish_id)

exports.removeDish = async dish_id => await Menu.deleteOne({ _id: dish_id })

exports.getCompleteMenu = async () => await Menu.find({})

exports.getFoodCategories = async () => await Menu.find().distinct('category')

exports.findCategories = async category => await Menu.findOne({ category })

exports.getMenuByCategory = async category => await Menu.find({ category })

exports.addOrUpdateRatingToDish = async (dish_id, data) => {
    let updateDishRatings = await Menu.findById(dish_id)
    let flag = 0
    updateDishRatings.ratings.forEach(async (rating) => {
        console.log(rating)
        if (data.user_id == rating.user_id) {
            console.log('id matched, stars updated')
            rating.stars = data.stars
            flag = 1
        }
    });
    if (flag === 0) {
        console.log("new entry")
        await Menu.updateOne({ _id: dish_id }, { $addToSet: { ratings: data } })
    }

    updateDishRatings.save()
    return updateDishRatings
}

