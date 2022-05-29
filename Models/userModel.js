const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const taskModel = require("./taskModel");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw Error("Invalid email");
        },
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    tokens: [{
        token: {
            type: String,
            required: true,
            trim: true,
        }
    }],
    // for profile image:
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true,
});

schema.virtual('tasks', {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

schema.pre('save', async function (next) {
    const user = this;
    if (user.isModified("password"))
        user.password = await bcrypt.hash(user.password, 8);
    next();
});

schema.methods.toJSON = function () {
    const user = this;
    const retObj = user.toObject();
    delete retObj.password;
    delete retObj.tokens;
    return retObj;
}

schema.methods.generateToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "123456789");
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

schema.statics.findCredentials = async (email, pass) => {
    const user = await model.findOne({ email });
    if (!user)
        throw new Error("Please Signin");
    const password = await bcrypt.compare(pass, user.password);
    if (!password)
        throw new Error("wrong password");
    return user;
}

schema.pre('remove', async function (next) {
    const user = this;
    await taskModel.deleteMany({ owner: user._id });
    next();
})


const model = mongoose.model("User", schema, "User");
module.exports = model;