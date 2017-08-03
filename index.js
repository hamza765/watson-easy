var express = require('express');
var http = require('http');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var app = express();
app.server = http.createServer(app);

const username = "a6a74c07-d356-4a59-81cd-4a05efb0151e";
const password = "YFbCBZzpns7N";

var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var personality_insights = new PersonalityInsightsV3({
    username: username,
    password: password,
    version_date: '2016-10-20'
});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('./client'));

// app.get('/', function(req, res) {
//     res.sendFile('index.html')
// });

app.post("/profile", function(req, res) {
    var content = req.body.content
    var params = {
        // Get the content items from the JSON file.
        text: content,
        consumption_preferences: true,
        raw_scores: true,
        headers: {
            'accept-language': 'en',
            'accept': 'application/json'
        }
    };


    personality_insights.profile(params, function(error, response) {
        if (error)
            console.log('Error:', error);
        else
        	res.json(response)
            // console.log(JSON.stringify(response, null, 2));
    });

});


app.server.listen(process.env.PORT || 8080);

console.log(`Started on port ${app.server.address().port}`);