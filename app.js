//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-eyal:test123@cluster0.br9t4.mongodb.net/WikiDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(function (req, res) {
        Article.find({}, function (err, foundArticles) {
            if (err) {
                res.send(err);
            } else {
                res.send(foundArticles);
            }
        });
    })
    .post(function (req, res) {
        const title = req.body.title;
        const content = req.body.content;
        const article = new Article({
            title: title,
            content: content,
        });
        article.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully added a new article.");
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully deleted Database.");
            }
        });
    });

/////////////////////////////Requests Targeting A Specific Article///////////////////////////////

app.route("/articles/:title")
    .get(function (req, res) {
        const artucleTitle = req.params.title;
        Article.findOne({ title: artucleTitle }, function (err, foundArticle) {
            if (err) {
                res.send(err);
            } else if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles with that name where found.");
            }
        });
    })
    .put(function (req, res) {
        const artucleTitle = req.params.title;
        Article.update(
            { title: artucleTitle },
            { title: req.body.title, content: req.body.content },
            {overwrite: true},
            function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(artucleTitle + " updated Successfully to " + req.body.title + ".");
                }
            }
        );
    })
    .patch(function (req, res) {
        const artucleTitle = req.params.title;
        Article.update(
            { title: artucleTitle },
            { $set: req.body  },
            {overwrite: true},
            function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(artucleTitle + " patched Successfully.");
                }
            }
        );
    })
    .delete(function (req, res) {
        const artucleTitle = req.params.title;
        Article.deleteOne(
            { title: artucleTitle },
            function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(artucleTitle + " deleted Successfully.");
                }
            }
        );
    });

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000");
});
