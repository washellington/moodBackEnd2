"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _user = require("../models/user.model");

var _user2 = _interopRequireDefault(_user);

var _password_recovery = require("../models/password_recovery.model");

var _password_recovery2 = _interopRequireDefault(_password_recovery);

var _crypto = require("crypto");

var crypto = _interopRequireWildcard(_crypto);

var _mongodb = require("mongodb");

var _mental_state = require("./mental_state.controller");

var _mental_state2 = _interopRequireDefault(_mental_state);

var _uuid = require("uuid");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sgMail = require("@sendgrid/mail");

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
    key: "reset_password",
    value: async function reset_password(req, res) {
      var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

      await client.connect();
      var db = client.db("moodyDb");
      var reset_password = {
        email: req.body.email,
        password: req.body.password,
        token: req.body.token
      };

      var passwordRecoveryResults = await db.collection("PasswordRecovery").find({ email: reset_password.email }).sort({ expiration_date: -1 }).toArray();
      console.log(passwordRecoveryResults[0]);

      var recoveryHash = crypto.createHmac("sha512", reset_password.email).update(reset_password.token).digest("base64");

      if (passwordRecoveryResults[0].hashed_token != recoveryHash) {
        res.status(500).send({
          err: "Could not validate token"
        });
        return;
      }
      if (Date.now() > passwordRecoveryResults[0].expiration_date) {
        res.status(500).send({
          err: "Token expired"
        });
        return;
      }
      var newPassword = {};
      newPassword.salt = crypto.randomBytes(16).toString("base64");
      var hash = crypto.createHmac("sha512", newPassword.salt).update(reset_password.password).digest("base64");
      newPassword.password = hash;
      db.collection("User").updateOne({ email: reset_password.email }, { $set: newPassword }, {}, function (err, results) {
        if (err) {
          res.status(500).send({
            err: "Could not update password"
          });
        } else {
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
      var id = req.params.id || req.userId;

      var user = await db.collection("User").findOne({ _id: (0, _mongodb.ObjectId)(id) });

      if (user) {
        console.log("found user:", user);
      } else {
        console.warn("could not find user with id: ", id);
      }
      res.status(200).send({
        userId: user._id,
        email: user.email,
        fullName: user.firstName + " " + user.lastName
      });
    }
  }, {
    key: "recover_account",
    value: async function recover_account(req, res) {
      var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

      try {
        await client.connect();
      } catch (e) {
        console.error(e);
      }
      var db = client.db("moodyDb");
      var email = req.body.email;

      var user = await db.collection("User").findOne({ email: email });

      if (user) {
        console.log("found user:", user);
        var token = (0, _uuid.v4)();
        var hash = crypto.createHmac("sha512", email).update(token).digest("base64");
        console.log(hash);
        var date_requested = new Date();
        var password_recovery = {
          email: email,
          hashed_token: hash,
          date_requested: date_requested.getTime(),
          expiration_date: (0, _moment2.default)(date_requested).add(10, "minute").valueOf()
        };
        db.collection("PasswordRecovery").insertOne(password_recovery, function (err, result) {
          if (err) {
            console.error(err);
            res.status(500).send({
              err: err
            });
          } else {
            console.log("results are = ", result);
            //send email with token
            UserController.sendEmail(email, token);
            res.sendStatus(200);
          }
        });
      } else {
        console.warn("could not find user with emai: ", email);
        res.status(500).send({
          err: "Could not find requested user"
        });
      }
    }
  }, {
    key: "info",
    value: function info(req, res) {
      console.log(req.userId, req.jwt);
      //res.send({ userId: req.userId });
      UserController.read(req, res);
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
  }, {
    key: "sendEmail",
    value: function sendEmail(email, token) {
      sgMail.setApiKey("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    ");
      var msg = {
        to: process.env.MOODY_ENV == "prod" ? email : "washellington@gmail.com",
        from: "support@moody.com",
        subject: "Reset Password Request",
        text: "Here is the link to reset your password. Note that the link will expire in 10 minutes. " + UserController.generateLink(token),
        html: "Here is the link to reset your password. \n      <br>\n      <strong>Note that the link will expire in 10 minutes.</strong>\n      <br>\n      <a href='" + UserController.generateLink(token) + "'>Reset Password</a>"
      };
      sgMail.send(msg);
    }
  }, {
    key: "generateLink",
    value: function generateLink(token) {
      if (process.env.MOODY_ENV == "prod") {
        return "moody.theconsciousobserver.com/reset_password?token=" + token;
      } else {
        return "http://localhost:3000/reset_password?token=" + token;
      }
    }
  }]);

  return UserController;
}();

exports.default = UserController;