/**
 * Created by David on 2014-11-15.
 */
/**
 * Created by kiastu on 05/11/14.
 */
// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); 		// call express
var app = express(); 				// define our app using express
var bodyParser = require('body-parser');
var jade = require('jade');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var request = require('request');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//public directory serves static pages
app.use("/", express.static(__dirname + "/public/"));

//specify rendering folder
app.set('views', __dirname);

//set default templating engine;
app.set('view engine', 'jade');

var port = process.env.PORT || 80; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// route middleware that will happen on every request
router.use(function (req, res, next) {

    // log each request to the console
    console.log(req.method, req.url);
    console.log("Request received, processing.");

    // continue doing what we were doing and go to the route
    next();
});

router.route('/yo')//http://yourcallbackurl.com/yourendpoint?username=THEYOER&location=42.360091;-71.094159
    .get(function (req, res) {
        var username = req.query.username;
        var location = req.query.location;
        console.log("location:"+location);
        var link = req.query.link;

        //send the yo out

        var http = new XMLHttpRequest();
        var url = "http://api.justyo.co/yo/";
        var params = {
            api_token:"api_token=9ffe5d65-0003-4525-be20-2af1e8deeb4e",
            username :username
        }
        http.open("POST", url, true);

        var split = location.split(";");
        //get api data.
        var gasrequest='http://devapi.mygasfeed.com/stations/radius/40.343989/-74.651448/10/reg/price/rfej9napna.json';
        request(gasrequest, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //Send the proper header information along with the request
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                //http.setRequestHeader("Content-length", params.length);
                //http.setRequestHeader("Connection", "close");

                http.onreadystatechange = function() {//Call a function when the state changes.
                    if(http.readyState == 4 && http.status == 200) {
                        console.log(params);
                        http.send(params);
                    }
                }
                console.log(params);
                http.send(params);
            }
        });




    });


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
