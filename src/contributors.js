"use strict";

const MongoClient = require("mongodb").MongoClient

const URI = process.env.MONGODB_URI;
console.log(URI);

exports.getContributors = function(callback) {
  MongoClient.connect(URI, function(err, db) {
    if (err) {
      callback(err);
      return;
    }

    var collection = db.collection("contributors");
    collection.find().toArray(function(err, docs) {
      if (err) {
        db.close();
        callback(err);
        return;
      }

      docs = docs.map(function(d) { return d.username; });
      db.close();
      callback(null, docs);
    });
  });
}

exports.addContributor = function(contributor, callback) {
  MongoClient.connect(URI, function(err, db) {
    if (err) {
      callback(err);
      return;
    }

    var collection = db.collection("contributors");
    collection.find({ username: contributor }).hasNext(function(err, hasNext) {
      if (err) {
        db.close();
        callback(err);
        return;
      }

      if (hasNext) {
        db.close();
        callback(null);
        return;
      }

      collection.insertOne({ username: contributor }, null, function(err) {
        db.close();
        callback(err);
      });
    });
  });
}
