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
    var taskList = [];
    Task.find().where('_id').in(taskids).exec((err, tasks) => {
        tasks.forEach((task) => {
            taskList.push(task);
        });
        res.send(taskList);
    });

});


//@route POST api/tasks/newtask
router.post("/newtask", (req, res) => {
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
		    color: req.body.color,
    }, function (err, task) {
        if (err) return console.log(err);
        res.send(task);
    });
});

router.post("/updatetask",(req,res)=>{
	update = {};
    if (req.body.name)
        update.name = req.body.name;

    if (req.body.description)
        update.description = req.body.description;

    if (req.body.assignTeamMembers)
        update.assignTeamMembers = req.body.assignTeamMembers;

    if (req.body.duration)
        update.duration = req.body.duration;

	if (req.body.deadline)
	    update.deadline = req.body.deadline;

	if (req.body.priority)
		update.priority = req.body.priority;

	if (req.body.acceptance)
		update.acceptance = req.body.acceptance;

	if(req.body.test)
		update.test = req.body.test;

	if(req.body.color)
		update.color = req.body.color;

	Task.findByIdAndUpdate(req.body.id, update)
		.then(() => {res.send({success: true})});
});

router.post('deletetask',async (req,res)=>{
	await Task.findByIdAndRemove(req.body.id, function(err,column) {
		if (err) return console.log(err);
	}).then(() => {
		res.send('deleted');
	});
});


module.exports = router;
