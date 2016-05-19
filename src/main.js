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

// For fun clabot doesn't use the normal style of node callbacks
function getContractors(callback) {
  contributors.getContributors(function(err, contributors) {
    if (err) {
      console.error(err);
      callback([]);
      return;
    }

    callback(contributors);
  })
}

function addContractor(contractor, callback) {
  contributors.addContributor(contractor, function(err) {
    console.error(err);
    callback(!err);
  });
}

clabot.createApp({
  app: claRoute,
  getContractors: getContractors,
  addContractor: addContractor,
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
  contributors.addContributor(req.body.username, function(err) {
    if (err) {
      res.status(500).send("Server Error");
    } else {
      res.redirect(301, "/static/signed.html")
    }
  });
});

app.get("/list", function(req, res) {
  contributors.getContributors(function(err, list) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.status(200).set("Content-Type", "text/plain").send("Contributors:\n\n" + list.join("\n"));
  });
});

const port = process.env.PORT || 1337;

app.listen(port);
console.log("Listening on " + port);
