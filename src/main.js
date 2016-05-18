"use strict";

const path = require("path");

const express = require("express");
const clabot = require("clabot");
const contributors = require("./contributors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.redirect(301, "/static/index.html");
});

app.use("/static", express.static(path.join(__dirname, "..", "static")));

app.post("/sign", function(req, res) {
  contributors.addContributor(req.body.email, function(err) {
    if (err) {
      res.status(500).send("Server Error");
    } else {
      res.redirect(301, "/static/signed.html")
    }
  });
});

clabot.createApp({
  app: app,
  getContractors: contributors.getContributors,
  addContractor: contributors.addContributor,
  token: process.env.GITHUB_TOKEN,
  templateData: {
    link: 'http://localhost/contributorform',
    maintainer: 'Mossop'
  },
  secrets: {
    'Mossop': {
      'tofino': process.env.MOSSOP_TOFINO_SECRET
    }
  }
});

//app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 1337;

app.listen(port);
console.log("Listening on " + port);
