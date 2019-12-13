// Require Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const axios = require("axios");
const request = require("request");
const cheerio = require("cheerio");

// Set up the Express App
const app = express();
let PORT = process.env.PORT || 3020;

app.use(express.static(__dirname + "/public"));

// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up Handlebars
let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// require models
// const db = require("./models");

// Setup Mongo connection
let db = process.env.MONGODB_URI || "mongodb://localhost/news";
mongoose.connect(db, function(error) {
    if(error) {
        console.log(error);
    } else {
        console.log("Mongoose connection successful!");
    }
});
// let db = mongoose.connection();

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
        link: "http://www.google.com",
        sub: "testing for a sub header"
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
            newArticle.sub = getSub(newArticle.link);
            // axios.get(newArticle.link)
            // .then(function(results) {
            //     // console.log(results.data);
            //     let sub = cheerio.load(results.data);

            //     newArticle.sub = sub(".content-dek").children("p").text();

            // });
            
            scrapedData.push(newArticle);
        });

        let articles = [];

        for (let i=0; i<10; i++) {
            // console.log(scrapedData.length);
            let item = scrapedData.splice(Math.floor(Math.random() * scrapedData.length), 1);
            articles.push(item);
        }

        console.log(articles);
        console.log("\n--------------------");  

    });

    res.send("route worked");
});

function getSub(site) {
    axios.get(site)
        .then(function(results) {
            // console.log(results.data);
            let sub = cheerio.load(results.data);

           return sub(".content-dek").children("p").text();

        })
        .catch(function(err) {
            console.log(err);
        });
}


// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});
