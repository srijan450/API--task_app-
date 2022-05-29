const express = require("express");
const route = express.Router();
const userModel = require("../Models/userModel");
const auth = require("../Auth/auth");
const multer = require("multer");

route.post("/user", async (req, res) => {
    try {
        const user = new userModel(req.body);
        // console.log(req);
        await user.save();
        const token = await user.generateToken();

        res.status(201).json({ user, token });
    }
    catch (e) {
        res.status(500).send(e);
    }
});

route.post("/user/login", async (req, res) => {
    try {
        const user = await userModel.findCredentials(req.body.email, req.body.password);
        const token = await user.generateToken();
        res.status(201).json({ user, token });
    }
    catch (e) {
        res.status(404).send(e);
    }
});

route.get("/user", auth, (req, res) => {
    try {
        const request = req.user;
        res.status(200).send(request);
    } catch (e) {
        res.status(404).send(e);
    }
});

route.post("/user/logout", auth, async (req, res) => {
    try {


        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        })
        await req.user.save();
        res.status(201).send("Logout successful!");
    }
    catch (e) {
        res.status(500).send("error in loging out!")
    }
});

route.post("/user/logout-all", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(201).send("Logout suceessful from all the devices");
    } catch (e) {
        res.status(500).send("error");
    }
});

route.patch("/user", auth, async (req, res) => {
    try {
        const allowed_updates = ["name", "password", "age"];
        const requested_updates = Object.keys(req.body);
        const isValidUpdate = requested_updates.every((key) => allowed_updates.includes(key));
        if (!isValidUpdate)
            throw new Error()
        requested_updates.forEach((key) => req.user[key] = req.body[key]);
        await req.user.save();
        res.status(200).send(req.user);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

route.delete("/user", auth, async (req, res) => {
    try {
        await req.user.remove();
        res.status(200).send("Bye Bye");
    } catch (e) {
        res.status(500).send("error");
    }
})

// user profile image upload:
// please reffer 3FileUpload in case of confusion:
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/))
            cb(new Error("Only images files are allowed"));
        cb(undefined, true)
    }
});
route.post("/user/profile/image", auth, upload.single("userimg"), async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send("success");
}, (err, req, res, next) => {
    res.status(400).send({ error: err.message });
})

route.delete("/user/profile/image", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save()
    res.send();
})

// getting image from database
route.get("/user/:id/image", async (req, res) => {
    const user = await userModel.findById(req.params.id);
    if (!user || !user.avatar)
        throw new Error("SOme Error");

    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
})
module.exports = route;