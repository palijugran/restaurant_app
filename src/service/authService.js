const User = require('../model/User');
const RefreshToken = require('../model/RefreshToken');

exports.findUser = async email => await User.findOne({ email });

exports.createRefreshToken = async data => {
    const { userId, refresh_token } = data
    const now = new Date();
    const expHour = 24 * 7; //one week
    const expiry = now.getTime() + (expHour * 60000 * 60); //now.getTime()=> aaj ki date ka time, 60000ms=1min * 60 => 1 hour
    const userExists = await RefreshToken.findOne({
        user_id: userId,
        expires_in: { $gte: now.getTime() }
    });
    if (!userExists) {
        //inserting token into the db
        const data = { user_id: userId, token: refresh_token, expires_in: expiry }
        return token = await RefreshToken.create(data);
    }
    //since token already exists
    const token = await RefreshToken.findOneAndUpdate({ user_id: userId }, { token: refresh_token })
    return token;
}

exports.findToken = async rtoken => {
    const currentTime = new Date().getTime();
    return foundToken = await RefreshToken.find({ token: rtoken, expires_in: { $gte: currentTime } });
};

exports.createUser = async data => await User.create(data)