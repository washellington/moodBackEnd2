"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _user = require("../models/user.model");

var _user2 = _interopRequireDefault(_user);

var _crypto = require("crypto");

var crypto = _interopRequireWildcard(_crypto);

var _mongodb = require("mongodb");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uri = "mongodb+srv://moodyApi:nsusga06@cluster0-b4mio.gcp.mongodb.net/test?retryWrites=true&w=majority";

//Simple version, without validation or sanitation

var UserController = function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, null, [{
    key: "test",
    value: function test(req, res) {
      res.send("Greetings from the Test controller!");
    }
  }, {
    key: "create",
    value: async function create(req, res) {
      var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

      await client.connect();
      var db = client.db("moodyDb");
      var user = {
        email: req.body.email,
        password: req.body.password,
        salt: "",
        firstName: req.body.first_name || "",
        lastName: req.body.last_name || ""
      };
      console.log(user);
      user.salt = crypto.randomBytes(16).toString("base64");
      var hash = crypto.createHmac("sha512", user.salt).update(user.password).digest("base64");
      console.log(hash);
      user.password = hash;
      db.collection("User").insertOne(user, function (err, result) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          console.log("results are = ", result);
          res.sendStatus(200);
        }
      });
    }
  }, {
    key: "read",
    value: async function read(req, res) {
      var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

      try {
        await client.connect();
      } catch (e) {
        console.error(e);
      }
      var db = client.db("moodyDb");
      var id = req.params.id;

      var user = await db.collection("User").findOne({ _id: (0, _mongodb.ObjectId)(id) });

      if (user) {
        console.log("found user:", user);
      } else {
        console.warn("could not find user with id: ", id);
      }
      res.sendStatus(200);
    }
  }, {
    key: "update",
    value: async function update(req, res) {
      var userParams = {
        firstName: req.body.first_name,
        lastName: req.body.last_name
      };
      var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

      try {
        await client.connect();
      } catch (e) {
        console.error(e);
      }
      var db = client.db("moodyDb");
      var id = req.params.id;

      var userResult = await db.collection("User").updateOne({ _id: (0, _mongodb.ObjectId)(id) }, { $set: userParams });

      console.log("updated user result :", userResult);

      res.sendStatus(200);
    }
  }, {
    key: "delete",
    value: async function _delete(req, res) {
      var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

      try {
        await client.connect();
      } catch (e) {
        console.error(e);
      }
      var db = client.db("moodyDb");
      var id = req.params.id;

      var userResult = await db.collection("User").deleteOne({ _id: (0, _mongodb.ObjectId)(id) });

      console.log("updated user result :", userResult);

      res.sendStatus(200);
    }
  }]);

  return UserController;
}();

exports.default = UserController;