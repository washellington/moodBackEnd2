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

  await db.createCollection("User", {
    validationLevel: "strict",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["email", "password"],
        properties: {
          firstName: {
            bsonType: "string",
            description: "must be a string"
          },
          lastName: {
            bsonType: "string",
            description: "must be a string "
          },
          email: {
            bsonType: "string",
            pattern: "^.+@.+$",
            description: "must be a valid email and is required"
          },
          password: {
            bsonType: "string",
            description: "must be a string and is required"
          }
        }
      }
    }
  });

  return db;
}

var User = initialize();

exports.default = User;