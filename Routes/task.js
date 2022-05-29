const express = require("express");
const auth = require("../Auth/auth");
const taskModel = require("../Models/taskModel");

const route = express.Router();

route.post("/task", auth, async (req, res) => {
    try {
        const allowed_keys = ["task", "description", "completed", "date"];
        const request_keys = Object.keys(req.body);
        const isAllowed = request_keys.every((key) => allowed_keys.includes(key));
        if (!isAllowed)
            throw new Error();
        const task = await new taskModel({
            ...req.body,
            owner: req.user._id
        });
        await task.save();
        res.status(201).send(task);
    }
    catch (e) {
        res.status(500).send("error");
    }
})

route.get("/task/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const task = await taskModel.findOne({ _id: _id, owner: req.user._id });
        if (!task)
            res.status(404).send("restricted access");

        else
            res.send(task);
    }
    catch (e) {
        res.status(500).send(e);
    }
});

route.get("/task", auth, async (req, res) => {
    try {
        const match = {};
        const sort = {};
        if (req.query.completed)
            match.completed = req.query.completed === 'true';

        if (req.query.sortBy) {
        
            const part = req.query.sortBy.split(":");
            sort[part[0]] = (part[1] === 'desc') ? -1 : 1;
        }
        // -1 for desc and 1 for asc.

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
            }
        });
        res.send(req.user.tasks);
    }
    catch (e) {
        res.status(500).send(e);
    }
})

route.patch("/task/:id", auth, async (req, res) => {
    try {
        const allowed_keys = ["task", "description", "completed", "date"];
        const request_keys = Object.keys(req.body);
        const isValid = request_keys.every((key) => allowed_keys.includes(key));
        if (!isValid)
            res.status(403).send("invalid updates");
        else {
            const _id = req.params.id;
            const task = await taskModel.findOne({ _id: _id, owner: req.user._id });

            if (!task) {
                res.status(404).send("invalid access");
                return;
            }
            request_keys.forEach((key) => {
                task[key] = req.body[key];
            })
            await task.save();
            res.status(203).send(task);
        }
    }
    catch (e) {
        res.status(500).send();
    }
})

route.delete("/task/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const task = await taskModel.findOne({ _id: _id, owner: req.user._id })
        await task.remove();
        res.send("deleted!")
    }
    catch (e) {
        res.status(500).send(e);
    }
})

route.delete("/tasks", auth, async (req, res) => {
    try {
        await taskModel.deleteMany({ owner: req.user._id })
        res.send("deleted!");
    }
    catch (e) {
        res.status(500).send(e);
    }
})

module.exports = route;