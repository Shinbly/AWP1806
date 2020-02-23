const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const validateColumnInput = require("../../validation/column");

//Load column model
const Column = require("../../models/Column");

//@route POST api/columns/getcolumns
//@desc Get columns of the user
//@access Public
router.post("/getcolumns", (req, res) => {
    const columnids = req.body.ids;
    console.log(req.body);
    var columnList = [];
    Column.find().where('_id').in(columnids).exec((err, columns) => {
        if (columns.length > 0) {
            columns.forEach((column) => {
                columnList.push(column);
            });
            res.send(columnList);
        }
    });

});

//@route POST api/columns/newcolumn
router.post("/newcolumn", (req, res) => {
    console.log('new Column', req.body);

    //Form validation
    const { errors, isValid } = validateColumnInput(req.body);

    //Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Column.create({
        name: req.body.name,
        tasks: req.body.tasks,
        movableByMembers: req.body.movableByMembers,
        limitation: req.body.limitation,
    }, function (err, column) {
        if (err) console.log(err);
        res.send(column);
    });
});

router.post("/updatecolumn", (req, res) => {
    console.log('Update Column', req.body);
    update = {};
    if (req.body.name != null)
        update.name = req.body.name;
    if (req.body.tasks != null)
        update.tasks = req.body.tasks;
    if (req.body.movableByMembers != null)
        update.movableByMembers = req.body.movableByMembers;
    if (req.body.limitation != null)
        update.limitation = req.body.limitation;
    Column.findByIdAndUpdate(req.body.id, update)
        .then(() => {res.send({success: true})});
});

router.post("deletecolumn",(req,res)=>{
	console.log('Delete Column', req.body);
	Column.findByIdAndRemove(req.body.id, function(err,column) {
		if (err) return console.log(err);
		var taskIds = column.tasks;
		return taskIds.forEach((taskId) => {
			Task.findByIdAndRemove(taskId);
		});
	}).then(() => {
		res.send({success: true});
	});
});


module.exports = router;
