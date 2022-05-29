const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = await jwt.verify(token, "123456789");
        const user = await userModel.findOne({ _id: decode._id, "tokens.token": token });
        if (!user)
            throw new Error();
        req.user = user;
        req.token = token;
        next();
    }
    catch (e) {
        res.status(401).send({ error: "Please Authenticate" });
    }
}
module.exports = auth;