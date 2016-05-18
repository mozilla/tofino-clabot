"use strict";

const path = require("path");

const express = require("express");
const clabot = require("clabot");
const contributors = require("./contributors");
const bodyParser = require("body-parser");

const app = express();
const claRoute = new express.Router();
app.use("/clabot", claRoute);

app.get("/", function(req, res) {
  res.redirect(301, "/static/index.html");
});

clabot.createApp({
  app: claRoute,
  getContractors: contributors.getContributors,
  addContractor: contributors.addContributor,
  token: process.env.GITHUB_TOKEN,
  templateData: {
    link: "https://mozilla-cla.herokuapp.com/",
    maintainer: 'Mossop'
  },
  skipCollaborators: false,
  skipContributors: false,
  secrets: {
    'Mossop': {
      'tofino': process.env.MOSSOP_TOFINO_SECRET
    }
  }
});

app.use("/submit", bodyParser.urlencoded({ extended: true }));

app.use("/static", express.static(path.join(__dirname, "..", "static")));

app.post("/submit/sign", function(req, res) {
  contributors.addContributor(req.body.email, function(err) {
    if (err) {
      res.status(500).send("Server Error");
    } else {
      res.redirect(301, "/static/signed.html")
    }
  });
});

const port = process.env.PORT || 1337;

app.listen(port);
console.log("Listening on " + port);
