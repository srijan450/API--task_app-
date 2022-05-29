const express = require("express");
const port = process.env.port || 8000;
const userRoutes = require("./Routes/user");
const taskRoutes = require("./Routes/task");
const taskModel = require("./Models/taskModel");
const model = require("./Models/userModel");
require("./DB/conn");

const app = express();
app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
    console.log(`Server started at port ${port}.`);
});

const merge_task_user = async (id) => {
    const task = await taskModel.findById(id)
    await task.populate("owner")
    console.log(task);
}

const merge_user_task = async (id) => {
    const user = await model.findById(id);
    await user.populate("tasks")
    console.log(user.tasks);

}