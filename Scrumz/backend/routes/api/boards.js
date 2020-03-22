const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//Load board model
const Board = require("../../models/Board");
//Load column model
const Column = require("../../models/Column");
//Load board model
const Task = require("../../models/Task");

//@route POST api/boards/getboards
//@desc Get boards of the user
//@access Public
router.post("/getboards", (req,res) => {
	const userid = req.body.id;
	console.log(req.body);

	//Find the boards
	// Board.find({members: userid}.then(boards => {
	// 	if(!boards){
	// 		return res.status(404).json({noboards: "No boards found"});
	// 	}else{
	// 		const payload = {
	// 			userid: userid,
	// 			boards: res.json({board: boards})
	// 		};
	// 	}
	//
	//
	// }));

	Board.find({members: userid}, function(err, boards) {
		var boardMap = [];
		boards.forEach(function(boards) {
			boardMap.push(boards);
		});

		res.send(boardMap);

	})
});

//@route POST api/boards/getboardbyid
router.post("/getboardbyid", (req,res)=>{
	console.log('getboardbyid ', req.body);

	Board.findById(req.body.id, function(err,board){
		if (err) return console.log(err);
		console.log(board);
		res.send(board);
	})
});

//@route POST api/boards/newboard
router.post("/newboard", (req, res) => {
	console.log('newBoard ', req.body);
	Board.create({
		name : req.body.name,
		columns : req.body.columns,
		members : req.body.members,
		manager : req.body.manager,
		archived_tasks : [],
		logs: [`Creation of the Board : ${req.body.name}`],
	}, function(err,board){
		if (err) return console.log(err);
		res.send(board);
	});
});

//@route POST api/boards/updateboard
router.post("/updateboard", (req, res) => {
	console.log('Update Board ', req.body);

	update = {};
	if (req.body.columns)
		update.columns = req.body.columns;
	if (req.body.members)
		update.members = req.body.members;
	if(req.body.archived_tasks)
		update.archived_tasks = req.body.archived_tasks;
	if(req.body.logs)
		update.logs = req.body.logs;



	Board.findByIdAndUpdate(req.body.id,update).then(() => {
		res.send({success: true});
	});;
});

router.post("/deleteboard",(req,res) =>{
	console.log('Delete Board ', req.body);
	var Boardid = req.body.id;
	Board.findByIdAndRemove(Boardid, function (err, board) {
		if (err) return console.log(err);
		var columnIds = board.columns;
		return columnIds.forEach((columnId) => {
			Column.findByIdAndRemove(columnId, function(err,column) {
				if (err) return console.log(err);
				var taskIds = column.tasks;
				return taskIds.forEach((taskId) => {
					Task.findByIdAndRemove(taskId);
				});
			});
		});
	}).then(() => {
		res.send({success: true});
	});
});

//@route POST api/boards/addmember
router.post("/addmember", (req, res) => {
	console.log('Add member', req.body);

	update = {};
	update.members = req.body.members;

	Board.findByIdAndUpdate(req.body.id,update).then(() => {
		res.send({success: true});
	});;
});

module.exports = router;
