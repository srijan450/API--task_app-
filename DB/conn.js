const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/task_app", {
    useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to Database");
}).catch((e) => {
    console.log(e);
})