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

  await db.createCollection("MentalState", {
    validationLevel: "strict",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["rating", "mood_type", "date_created", "entry_date", "user"],
        properties: {
          rating: {
            bsonType: "number",
            description: "must be number and is required"
          },
          mood_type: {
            bsonType: "string",
            description: "must be object id of the mood type and is required"
          },
          date_created: {
            bsonType: "number",
            description: "must be a unix timestamp number and is required"
          },
          entry_date: {
            bsonType: "number",
            description: "must be a unix timestamp number and is required"
          },
          user: {
            bsonType: "string",
            description: "must be a object id of the user and is required"
          },
          notes: {
            bsonType: "string"
          }
        }
      }
    }
  });

  return db;
}

var MentalState = initialize();

exports.default = MentalState;