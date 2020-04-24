const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//Load board model
const Board = require("../../models/Board");
//Load column model
const Column = require("../../models/Column");
//Load board model
const Task = require("../../models/Task");

const Project = require("../../models/Project");

//@route POST api/projects/getprojects
//@desc Get Project where the user is member of a board in the project
//@access Public
router.post("/getprojects", async (req,res) => {
	const userId = req.body.id;
  var boardsId = [];
	var projectsMap  = [];
	await Project.find({manager : userId}, function(err, projects){
		if (err) return console.log(err);
		projects.forEach((p, i) => {
			projectsMap.push(p);
		});
	});
  await Board.find({members: userId},function(err, boards) {
    boards.forEach(function(boards) {
      boardsId.push(boards._id);
    });
  });
	await Project.find({ boards: { $in: boardsId }},function(err,projects){
		var projectsMap = [];
		projects.forEach((p, i) => {
			if(!projectsMap.includes(p)){
				projectsMap.push(p);
			}
		});
	});
	res.send(projectsMap);
});

//@route POST api/projects/getprojectbyid
router.post("/getprojectbyid", (req,res)=>{
	Project.findById(req.body.id, function(err,project){
		if (err) return console.log(err);
		res.send(project);
	})
});

//@route POST api/projects/newproject
router.post("/newproject", (req, res) => {
	Project.create({
		name : req.body.name,
		boards : [],
		manager : req.body.manager,
	}, function(err,project){
		if (err) return console.log(err);
		res.send(project);
	});
});

//@route POST api/projects/updateproject
router.post("/updateproject", (req, res) => {
	update = {};
	if (req.body.boards)
		update.boards = req.body.boards;
	if (req.body.name)
		update.name = req.body.name;
	if(req.body.manager)
		update.manager = req.body.manager;
	Project.findByIdAndUpdate(req.body.id,update).then((err,project) => {
    if (err) return console.log(err);
		res.send("ok");
	});;
});

//@route POST api/projects/deleteproject
router.post("/deleteproject",async (req,res) =>{
	var projectId = req.body.id;
  await Project.findById(projectId,async  function(err,project){
		if (err) return console.log(err);
		project.boards.forEach(async (boardId) => {
      await Board.findById(boardId,function(err,board){
        board.archived_tasks.forEach(async (archivedTasksId) => {
          	await Task.findByIdAndRemove(archivedTasksId);
        });
        board.columns.forEach(async (columnId) => {
          await Column.findById(columnId,function(err,column){
            column.tasks.forEach(async (taskId, i) => {
              await Task.findByIdAndRemove(taskId);
            });
          });
          await Column.findByIdAndRemove(columnId);
        });
      });
      await Board.findByIdAndRemove(boardId);
    });
	});
  await Project.findByIdAndRemove(projectId);
  res.send('deleted');
});

module.exports = router;
