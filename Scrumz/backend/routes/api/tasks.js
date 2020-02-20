const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const validateTaskInput = require("../../validation/task");

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


//@route POST api/tasks/newtask
router.post("/newtask", (req, res) => {
    console.log('new task', req.body);
    //Form validation
    const { errors, isValid } = validateTaskInput(req.body);

    //Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    Task.create({
        name: req.body.name,
        description: req.body.description,
        assignTeamMembers: req.body.assignTeamMembers,
        duration: req.body.duration,
        deadline: req.body.deadline,
        priority: req.body.priority,
        acceptance: false,
        test: req.body.test,
    }, function (err, task) {
        if (err) return handleError(err);
        res.send(task);
    });
});


module.exports = router;
