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

var uri = "mongodb+srv://moodyApi:WAS&amr13@cluster0-jndzm.gcp.mongodb.net/test?retryWrites=true&w=majority";

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
        firstName: req.body.first_name,
        lastName: req.body.last_name
      };
      user.salt = crypto.randomBytes(16).toString("base64");
      var hash = crypto.createHmac("sha512", user.salt).update(user.password).digest("base64");
      user.password = user.salt + "$" + hash;
      db.collection("User").insertOne(user, function (err, result) {
        if (err) throw err;
        console.log("results are = ", result);
      });
    }
  }]);

  return UserController;
}();

exports.default = UserController;