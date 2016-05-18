"use strict";

const path = require("path");
const fs = require("fs");

const DATA_FILE = path.normalize(path.join(__dirname, "..", "contributors"));

// We use synchronous file access here because it somewhat protects us from
// multiple simultaneous reads and writes.

exports.getContributors = function(callback) {
  try {
    const lines = fs.readFileSync(DATA_FILE, { encoding: "utf8" });
    callback(null, lines.split("\n"));
  } catch (e) {
    console.error(e);
    callback(null, []);
  }
}

exports.addContributor = function(contributor, callback) {
  exports.getContributors(function(err, contributors) {
    if (err) {
      callback(err);
      return;
    }

    if (contributors.indexOf(contributor) >= 0) {
      callback(null);
      return;
    }

    try {
      fs.appendFileSync(DATA_FILE, contributor + "\n");
      callback();
    } catch (e) {
      callback(e);
    }
  });
}
