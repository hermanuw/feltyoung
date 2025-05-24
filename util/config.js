require("dotenv").config();

const SECRET = process.env.SECRET;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_USER = process.env.EMAIL_USER;  
module.exports = {
    SECRET,
    EMAIL_PASS,
    EMAIL_USER
};