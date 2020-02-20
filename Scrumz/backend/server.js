const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require("passport");
//const Data = require('./models/User');

const users = require("./routes/api/users");
const boards = require("./routes/api/boards");
const columns = require("./routes/api/columns");
const tasks = require("./routes/api/tasks");

const API_PORT = 3001;
const app = express();
//app.use(cors());
//made for logging and bodyParser, parses the request body to be a readble json
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));
//const router = express.Router();

//The mongoDB database
const dbRoute = require("./config/keys").mongoURI;

//connects the backend with the database
mongoose.connect(dbRoute, {useNewUrlParser: true})
	.then(() => console.log("mongoDB successfully connected"))
	.catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());

//Passport config
require("./config/passport")(passport);

//routes
app.use("/api/users", users);
app.use("/api/boards", boards);
app.use("/api/columns", columns);
app.use("/api/tasks", tasks);

//let db = mongoose.connection;

//db.once('open', () => console.log('connected to the database'));

//checks if connection with the database is successful
//db.on('error', console.error.bind(console, 'mongoDB connection error :'));

//the get method, fetches all available data in the database
// router.get('/getData', (req,res) => {
// 	Data.find((err,data) => {
// 		if (err) return res.json({success: false, error: err});
// 		return res.json({success: true, data: data});
// 	});
// });

//the update method, overwrites existing data in the database
// router.post('/updateData', (req,res) => {
// 	const {id, update} = req.body;
// 	Data.findByIdAndUpdate(id, update, (err) => {
// 		if (err) return res.json({success: false, error: err});
// 		return res.json({success: true});
// 	});
// });

//the delete method, removes existing data in the database
// router.delete('/deleteData', (req,res) => {
// 	const {id} = req.body;
// 	Data.findByIdAndRemove(id, (err) => {
// 		if (err) return res.send(err);
// 		return res.json({success: true});
// 	});
// });

//the create method, adds new data in the database
// router.post('/putData', (req,res) => {
// 	let data = new Data();
// 	const {id, message} = req.body;
// 	if((!id && id !==0) || !message){
// 		return res.json({
// 			success: false,
// 			error: 'INVALID INPUTS',
// 		});
// 	}
// 	data.message = message;
// 	data.id = id;
// 	data.save((err) => {
// 		if (err) return res.json({success: false, error: err});
// 		return res.json({sucess: true});
// 	});
// });

//append /api for the http requests
//app.use('/api', router);

//launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
