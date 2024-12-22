const express = require("express");
const app = express.Router();
const {LoginController, RegisterController} = require("../controller/authController");

app.route('/login').post(LoginController);
app.route('/register').post(RegisterController);


module.exports = app