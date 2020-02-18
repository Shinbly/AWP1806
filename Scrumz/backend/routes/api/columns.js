const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//Load board model
const Column = require("../../models/Column");

//@route POST api/boards/getcolumns
//@desc Get boards of the user
//@access Public
router.post("/getcolumns", (req, res) => {
    const columnids = req.body.ids;
    console.log(req.body);
    var columnList = [];
    Column.find().where('_id').in(columnids).exec((err, columns) => {
        columns.forEach((column)=>{
            columnList.push(column);
        });
        res.send(columnList);
     });
    
});

module.exports = router;
