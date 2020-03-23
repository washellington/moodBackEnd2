"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = require("crypto");

var crypto = _interopRequireWildcard(_crypto);

var _mongodb = require("mongodb");

var _authorization = require("../controllers/authorization.controller");

var _jsonwebtoken = require("jsonwebtoken");

var jwt = _interopRequireWildcard(_jsonwebtoken);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uri = "mongodb+srv://moodyApi:nsusga06@cluster0-b4mio.gcp.mongodb.net/test?retryWrites=true&w=majority";

var VerifyUserMiddleware = function () {
  function VerifyUserMiddleware() {
    _classCallCheck(this, VerifyUserMiddleware);
  }

  _createClass(VerifyUserMiddleware, null, [{
    key: "isPasswordAndUserMatch",
    value: async function isPasswordAndUserMatch(req, res, next) {
      var client = new _mongodb.MongoClient(uri, {
        useUnifiedTopology: true
      });
      try {
        await client.connect();
      } catch (e) {
        console.error(e);
      }
      var db = client.db("moodyDb");

      db.collection("User").findOne({ email: req.body.email }).then(function (user) {
        console.log("User = ", user);

        if (!user) {
          res.sendStatus(204);
        } else {
          var password = user.password;
          var salt = user.salt;
          var hash = crypto.createHmac("sha512", salt).update(req.body.password).digest("base64");
          if (hash == password) {
            req.body = {
              userId: user._id,
              email: user.email,
              name: user.firstName + " " + user.lastName
            };

            return next();
          } else {
            return res.status(400).send({ errors: ["Invalid email or password"] });
          }
        }
      });
    }
  }, {
    key: "validJWTNeeded",
    value: function validJWTNeeded(req, res, next) {
      console.log("validJWTNeeded");
      if (req.headers["authorization"]) {
        try {
          var authorization = req.headers["authorization"].split(" ");
          if (authorization[0] !== "Bearer") {
            return res.status(401).send();
          } else {
            req.jwt = jwt.verify(authorization[1], _authorization.jwtSecret);
            req.userId = req.jwt.userId;
            return next();
          }
        } catch (err) {
          return res.status(403).send({ err: "Username could not be validated" });
        }
      } else {
        return res.status(401).send();
      }
    }
  }]);

  return VerifyUserMiddleware;
}();

exports.default = VerifyUserMiddleware;