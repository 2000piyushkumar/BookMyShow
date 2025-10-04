const User = require("../models/model.user");

async function getAllUsers() {
    const users = await User.find();
    return users;
}

async function createUser(name, email, password, salt ) {
    const newUser = new User({ name, email, password, salt });
    await newUser.save();
    return newUser;   
}

async function findUserByEmail(email) {
    const user = await User.findOne({ email });
    return user;
}

module.exports = { getAllUsers, createUser, findUserByEmail };