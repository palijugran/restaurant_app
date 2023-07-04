const menuService = require('../service/menuService');
const responder = require('../utils/responder');
const throwError = require('../utils/createError');
const GetMenuResponse = require('../resources/GetMenuResponse');

exports.addDishes = async (request, response, next) => {
    try {
        const { dish_name, description, type, category, price, thumbnail, rating } = request.body
        const existingDishName = await menuService.findDishName(dish_name);
        if (existingDishName) {
            throw throwError(request, 409, {}, 404)
        }
        const data = { dish_name, description, type, category, price, thumbnail, rating }

        request.file ? data.thumbnail = request.file.location : data.thumbnail = null

        const dishAdded = await menuService.addDish(data)
        if (!dishAdded) {
            throw throwError(request, 400, {}, 402)
        }
        return responder(response, true, 403, {})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.removeDish = async (request, response, next) => {
    try {
        const dish_id = request.params.dish_id;
        const dishFound = await menuService.findDishById(dish_id);
        if (!dishFound) {
            throw throwError(request, 404, {}, 405)
        }
        const deleteDish = await menuService.removeDish(dish_id);

        if (deleteDish.deletedCount === 0) {
            throw throwError(request, 400, {}, 407)
        }
        return responder(response, true, 406, {})
    }
    catch (error) {
        console.log(error)
        next(error)
    }
}

exports.completeMenu = async (request, response, next) => {
    try {
        const getMenu = await menuService.getCompleteMenu()

        if (getMenu.length === 0) {
            throw throwError(request, 404, {}, 401)
        }
        return responder(response, true, 201, GetMenuResponse.collection(getMenu))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.getCategories = async (request, response, next) => {
    try {
        const categories = await menuService.getFoodCategories()
        if (categories.length === 0) {
            throw throwError(request, 404, {}, 408)
        }
        return responder(response, true, 201, categories)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.getMenuByCategory = async (request, response, next) => {
    try {
        const { category } = request.body
        const findCategories = await menuService.findCategories(category)
        if (!findCategories) {
            throw throwError(request, 404, {}, 408)
        }
        const getMenu = await menuService.getMenuByCategory(category)
        return responder(response, true, 201, GetMenuResponse.collection(getMenu))
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.addOrUpdateRating = async (request, response, next) => {
    try {
        const user_id = request.userInfo.userId;
        const dish_id = request.params.dish_id
        const { stars } = request.body
        const dishFound = await menuService.findDishById(dish_id)
        if (!dishFound) {
            throw throwError(request, 404, {}, 405)
        }
        const data = { stars, user_id }
        const addStars = await menuService.addOrUpdateRatingToDish(dish_id, data)

        if (!addStars) {
            throw throwError(request, 400, {}, 409)
        }
        return responder(response, true, 410, {})

    } catch (error) {
        console.log(error)
        next(error)
    }
}


