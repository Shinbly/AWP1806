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
	Board.findById(req.body.id, function(err,board){
		if (err) return console.log(err);
		res.send(board);
	})
});

//@route POST api/boards/newboard
router.post("/newboard", (req, res) => {
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
	var Boardid = req.body.id;
	Board.findByIdAndRemove(Boardid, async function (err, board) {
		if (err) return console.log(err);
		return Promise.all(board.archived_tasks.map((taskId) => {
			return Task.findByIdAndRemove(taskId);
		})).then(async ()=>{
			return await Promise.all(board.columns.map((columnId) => {
				return Column.findByIdAndRemove(columnId, function(err,column) {
					if (err) return console.log(err);
					return Promise.all(column.tasks.map(async (taskId) => {
						await Task.findByIdAndRemove(taskId);
					}));
				});
			}));
		});

	}).then(() => {
		res.send({success: true});
	});
});

//@route POST api/boards/addmember
router.post("/updatemember", (req, res) => {

	update = {};
	update.members = req.body.members;

	Board.findByIdAndUpdate(req.body.id,update).then(() => {
		res.send({success: true});
	});;
});

module.exports = router;
