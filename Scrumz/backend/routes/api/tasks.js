const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//Load board model
const Task = require("../../models/Task");

//@route POST api/tasks/gettasks
//@desc Get tasks
//@access Public
router.post("/gettasks", (req, res) => {
    const taskids = req.body.ids;
    console.log(req.body.ids);
    var taskList = [];
    Task.find().where('_id').in(taskids).exec((err, tasks) => {
        tasks.forEach((task) => {
            taskList.push(task);
        });
        console.log(taskList);
        res.send(taskList);
    });

});

module.exports = router;
