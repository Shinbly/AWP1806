const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
//const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

//The mongoDB database
const dbRoute = 'mongodb+srv://dbUser:dbUserPassword@cluster0-ovn9n.gcp.mongodb.net/test?retryWrites=true&w=majority';

//connects the backend with the database
mongoose.connect(dbRoute, {useNewUrlParser: true});

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

//checks if connection with the database is successful
db.on('error', console.error.bind(console, 'mongoDB connection error :'));

//made for logging and bodyParser, parses the request body to be a readble json
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));

//the get method, fetches all available data in the database
router.get('/getData', (req,res) => {
	Data.find((err,data) => {
		if (err) return res.json({success: false, error: err});
		return res.json({success: true, data: data});
	});
})

//the update method, overwrites existing data in the database
router.post('/updateData', (req,res) => {
	const {id, update} = req.body;
	Data.findByIdAndUpdate(id, update, (err) => {
		if (err) return res.json({success: false, error: err});
		return res.json({success: true});
	});
});

//the delete method, removes existing data in the database
router.delete('/deleteData', (req,res) => {
	const {id} = req.body;
	Data.findByIdAndRemove(id, (err) => {
		if (err) return res.send(err);
		return res.json({success: true});
	});
});

//the create method, adds new data in the database
router.post('/putData', (req,res) => {
	let data = new Data();
	const {id, message} = req.body;
	if((!id && id !==0) || !message){
		return res.json({
			success: false,
			error: 'INVALID INPUTS',
		});
	}
	data.message = message;
	data.id = id;
	data.save((err) => {
		if (err) return res.json({success: false, error: err});
		return res.json({sucess: true});
	});
});

//append /api for the http requests
app.use('/api', router);

//launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
