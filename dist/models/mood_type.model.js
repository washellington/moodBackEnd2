"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongodb = require("mongodb");

var uri = "mongodb+srv://moodyApi:nsusga06@cluster0-b4mio.gcp.mongodb.net/test?retryWrites=true&w=majority";

async function initialize() {
  var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

  await client.connect();
  var db = client.db("moodyDb");

  await db.createCollection("MoodType", {
    validationLevel: "strict",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["mood_type"],
        properties: {
          mood_type: {
            bsonType: "string",
            description: "must be string and is required, describes what we are setting a mood rating to"
          }
        }
      }
    }
  });

  return db;
}

var MoodType = initialize();

exports.default = MoodType;