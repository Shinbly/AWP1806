const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

//Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateUpdateInput = require("../../validation/update");

//Load User model
const User = require("../../models/User");

//@route POST api/users/register
//@desc Register user
//@access Public
router.post("/register",async  (req,res) => {
	//Form validation
	const {errors, isValid} = validateRegisterInput(req.body);

	//Check validation
	if(!isValid) {
		return res.status(400).json(errors);
	}

	await User.findOne({email: req.body.email}).then(user => {
		if(user) {
			return res.status(400).json({ email: "Email already exists" });
		}else{
			const newUser = new User({
				username: req.body.username,
				email: req.body.email,
				password: req.body.password
			});

		//Hash password before saving in database
		bcrypt.genSalt(10, (err,salt) => {
			bcrypt.hash(newUser.password, salt, (err,hash) => {
				if(err) throw err;
				newUser.password = hash;
				newUser
					.save()
					.then(user => res.json(user))
					.catch(err => console.log(err));
			});
		});
		}

	});
});


//@route POST api/user/login
//@desc Login user and return JWT token
//@access Public
router.post("/login", async (req,res) => {
	//Form validation
	const {errors, isValid} = validateLoginInput(req.body);

	//Check validation
	if(!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	//Find user by email
	await User.findOne({email}).then(user => {
		//Check if user exists
		if(!user){
			return res.status(404).json({emailnotfound: "Email not found"});
		}

		//Check password
		bcrypt.compare(password, user.password).then(isMatch => {
			if (isMatch) {
				//User matched
				//Create JWT Payload
				const payload = {
					id: user.id,
					name: user.name
				};

				//Sign token
				jwt.sign(
					payload,
					keys.secretOrKey,
					{
						expiresIn: 31556926 //1 year in seconds
					},
					(err,token) => {
						res.json({
							succes: true,
							token: "Bearer" + token
						});
					}
				);
			}else{
				return res
					.status(400)
					.json({passwordincorrect: "Password incorrect"});
			}
		});
	});
});


//@route POST api/user/getuser
//@desc get user from id
//@access Public
router.post("/getuser", async (req,res) => {
	const userid = req.body.id;

	await User.findOne({_id: userid}, function(err,user){
		res.send(user);
	})
});

//@route POST api/user/getusers
//@desc get users from ids
//@access Public
router.post("/getusers", async (req, res) => {
	const userids = req.body.ids;
	await User.find().where('_id').in(userids).exec((err, users) => {
		res.send(users);
	})
});

//@route POST api/user/getuserfromemail
//@desc get user from email
//@access Public
router.post("/getuserfromemail",async  (req,res) => {
	const email = req.body.email;

	await User.findOne({email: email}, function(err,user){
		res.send(user);
	});
});


//@route POST api/user/updateuser
//@desc update user from id
//@access Public
router.post("/updateuser", async (req, res) => {

	//Form validation
	const {errors, isValid} = validateUpdateInput(req.body);

	//Check validation
	if(!isValid) {
		return res.status(400).json(errors);
	}

	const updateUser = {
		username: req.body.username,
		email: req.body.email
	};
	if(req.body.avatar != null){
		updateUser["avatar"] = req.body.avatar;
	}

	if(!(req.body.password === "")){
		//Hash password before saving in database
			bcrypt.genSalt(10, (err,salt) => {
			bcrypt.hash(req.body.password, salt, (err,hash) => {
				if(err) throw err;
				updateUser["password"] = hash;
				});
			});
	}


	User.updateOne({_id: req.body.id}, updateUser)
		.then(() => {res.send("ok");});

});

router.post("/deleteUser",async  (req,res) => {
	const userid = req.body.id;
	await User.findByIdAndRemove(userId);
});


module.exports = router;
