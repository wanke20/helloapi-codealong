var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Vehicle = require('./app/models/vehicle');

// Configure app for bodyParser()
// let us grab data from the body of POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up port for server to listen on
var port = process.env.PORT || 3000;

// Connect to database
mongoose.connect('mongodb://localhost:27017/codealong');

// API Routes
var router = express.Router();

// Routes will all be prefixed with /api
app.use('/api', router);

// MIDDLEWARE -
// Middleware can be very useful for doing validations. We can log
// things from here or stop the request from continuing in the event
// that the request is not safe.
// middleware to use for all requests
router.use(function(req, res, next) {
    console.log('FYI...There is some processing currently going down...');
    next();
});

// Test Routes
router.get('/', function(req, res) {
    res.json({message: 'Welcome to our API!'});
});

router.route('/vehicles')
    .post(async(req, res) => {
        var vehicle = new Vehicle(); // new instance of a vehicle
        vehicle.make = req.body.make;
        vehicle.model = req.body.model;
        vehicle.color = req.body.color;

        try {
            await vehicle.save()
            res.json({message: "Vehicle was successfully manufactured"});
        }
        catch (err) {
            res.send(err);
        }
})
   .get(async(req, res) => {
        try{
            res.json(await Vehicle.find());
        }
        catch{
            res.send(err);
        }
});

router.route('/vehicles/:vehicle_id').get(async(req, res) => {
    try{
        res.json(await Vehicle.findById(req.params.vehicle_id));
    }
    catch{
        res.send(err);
    }
});

router.route('/vehicles/make/:make')
.get(async(req, res) => {
    try{
        res.json(await Vehicle.find({make: req.params.make}));
    }
    catch{
        res.send(err);
    }
});

router.route('/vehicles/color/:color')
.get(async(req, res) => {
    try {
        res.json(await Vehicle.find({color: req.params.color}));
    }
    catch {
        res.send(err);
    }
});

// Fire up server
app.listen(port);
// Print friendly message to console
console.log('Server listening on port ' + port);