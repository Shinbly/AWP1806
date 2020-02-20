const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//Load board model
const Column = require("../../models/Column");

//@route POST api/columns/getcolumns
//@desc Get boards of the user
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
    Column.create({
        name: req.body.name,
        tasks: req.body.tasks,
        movableByMembers: req.body.movableByMembers,
        limitation: req.body.limitation,
    }, function (err, board) {
        if (err) return handleError(err);
        res.send(board);
    });
});


module.exports = router;
