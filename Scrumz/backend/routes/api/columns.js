const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const validateColumnInput = require("../../validation/column");

//Load column model
const Column = require("../../models/Column");

//@route POST api/columns/getcolumns
//@desc Get columns of the user
//@access Public
router.post("/getcolumns",async (req, res) => {
    const columnIds = req.body.ids;
    var columnList = [];
    await Column.find().where('_id').in(columnIds).exec((err, columns) => {
        if (columns!= null && columns.length > 0) {
            columns.forEach((column) => {
                columnList.push(column);
            });
            res.send(columnList);
        }
    });
});

//@route POST api/columns/getcolumntaskid
//@desc Get column where the task is
//@access Public
router.post("/getcolumntaskid", async (req, res) => {
    const taskId = req.body.taskId;
    await Column.findOne({'tasks': taskId}).exec((err, column) => {
        res.send(column);
    });


});

//@route POST api/columns/newcolumn
router.post("/newcolumn", async (req, res) => {

    //Form validation
    const { errors, isValid } = validateColumnInput(req.body);

    //Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    await Column.create({
        name: req.body.name,
        tasks: req.body.tasks,
        movableByMembers: req.body.movableByMembers,
        limitation: req.body.limitation,
    }, function (err, column) {
        if (err) console.log(err);
        res.send(column);
    });
});

//@route POST api/columns/updatecolumn
router.post("/updatecolumn", async (req, res) => {
    update = {};
    if (req.body.name != null)
        update.name = req.body.name;
    if (req.body.tasks != null)
        update.tasks = req.body.tasks;
    if (req.body.movableByMembers != null)
        update.movableByMembers = req.body.movableByMembers;
    if (req.body.limitation != null)
        update.limitation = req.body.limitation;
    await Column.findByIdAndUpdate(req.body.id, update)
        .then(() => {res.send({success: true})});
});


//@route POST api/columns/movetask
//{toId : idof the column where the task should go, taskId : the id of the task, index : the index where the task go}
router.post("/movetask", async (req, res) => {
  console.log('\n move task : \n\n');
    const taskId = req.body.taskId;
    const columnToId = req.body.toId;
    var index = -1;
    if (req.body.index != null){
      index = req.body.index;
    }
    console.log('taskId : '+taskId);
    console.log('columnToId : '+columnToId);

    await Column.findOne({'tasks': taskId}).exec(async (err, fromColumn) => {
      if (err) console.log(err);
      console.log('fromColumn : '+fromColumn._id);
        if(fromColumn._id == columnToId){
          if(index != -1){
            var tasks = [];
            tasks = toColumn.tasks;
            task.splice(index, 0, taskId);
            task.filter((value, i)=>{return (value != taskId || i != index); });
          }
          res.send();
        }else{
          await Column.findById(columnToId).exec(async (err, toColumn) => {
            if (err) console.log(err);

            var tasks = [];
            if(toColumn.tasks != null ){

              tasks = toColumn.tasks;


            }
            console.log('columnTotask before : '+tasks);

            if(index != -1){
              tasks.splice(index, 0, taskId);
            }else{
              tasks.push(taskId);
            }
            console.log('columnTotask after : '+tasks);

            var updateTo = {tasks  : tasks}
            await Column.findByIdAndUpdate(columnToId, updateTo).then(async ()=>{
              var tasksFrom = fromColumn.tasks
              console.log('columnfromtask before : '+tasksFrom);
              tasksFrom = tasksFrom.filter((value)=>{return value != taskId; });
              var updateFrom = {
                tasks : tasksFrom
              }
              console.log('columnfromtask after : '+tasksFrom);

              await Column.findByIdAndUpdate(fromColumn._id, updateFrom).then(()=>{
                res.send({
                  taskId : taskId,
                  fromColumn : fromColumn._id,
                  toColumn: columnToId
                });
                console.log('\n\n\n');
              });
            });
          });
        }
    });
});




router.post("/deletecolumn",async (req,res)=>{
	var columnId = req.body.id;
  await Column.findById(columnId,function(err,column){
    column.tasks.forEach(async (taskId, i) => {
      await Task.findByIdAndRemove(taskId);
    });
  });
  await Column.findByIdAndRemove(columnId);
  res.send('deleted');

});


module.exports = router;
