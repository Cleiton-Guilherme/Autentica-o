const Usuario = require("../model/usuario");
const jwt = require("jsonwebtoken");

const loginService = (email) => Usuario.findOne({ email });

const updateToken = (user) => {
    return Usuario.findByIdAndUpdate(user.id, user, { returnDocument: "after" });
}

const generateToken = (user, segredo) => jwt.sign({user}, segredo, { expiresIn: 86400});

module.exports = { loginService, updateToken, generateToken};