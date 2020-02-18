const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//Load board model
const Board = require("../../models/Board");

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

module.exports = router;
