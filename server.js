// Require Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const axios = require("axios");
const request = require("request");
const cheerio = require("cheerio");

// Set up the Express App
let app = express();
let PORT = process.env.PORT || 3020;

app.use(express.static(__dirname + "/public"));

// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up Handlebars
let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Setup Mongo connection
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news";
mongoose.connect(MONGODB_URI);

// require models
// const db = require("./models");

// db.on("error", function(error) {
//     console.log("Mongoose Error: ", error);
// });

// db.once("open", function() {
//     console.log("Mongoose connection successful!");
// });


// Set up route
app.get("/", function(req, res) {
    
    res.render("articles", {
        title: "testing the router",
        link: "http://www.google.com"
    });
});

// Scrape all data from site
app.get("/scrape", function(req, res) {
    let scrapedData = [];
    let searchURL = "https://www.oprahmag.com";
    axios.get(searchURL)
    .then(function(response) {

        let $ = cheerio.load(response.data);

        $(".custom-item-title").each(function(i, element) {
            let newArticle = {};
            newArticle.title = $(this).text();
            newArticle.link = searchURL + $(this).attr("href");
            
            scrapedData.push(newArticle);
        });

        let articles = [];

        for (let i=0; i<20; i++) {
            let item = scrapedData.pop(scrapedData[Math.floor(Math.random() * scrapedData.length)]);
            articles.push(item);
        }

        console.log(articles);  

    });

    res.send("route worked");
});


// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});
