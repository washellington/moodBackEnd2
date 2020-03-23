"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jwtSecret = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = require("crypto");

var crypto = _interopRequireWildcard(_crypto);

var _jsonwebtoken = require("jsonwebtoken");

var jwt = _interopRequireWildcard(_jsonwebtoken);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var jwtSecret = exports.jwtSecret = "jwtS3CR3TIsF1nallyHere";

var AuthorizationController = function () {
  function AuthorizationController() {
    _classCallCheck(this, AuthorizationController);
  }

  _createClass(AuthorizationController, null, [{
    key: "login",
    value: function login(req, res) {
      try {
        var refreshId = req.body.userId + jwtSecret;
        var salt = crypto.randomBytes(16).toString("base64");
        var hash = crypto.createHmac("sha512", salt).update(refreshId).digest("base64");
        req.body.refreshKey = salt;
        console.log(req.body);
        var token = jwt.sign(req.body, jwtSecret);
        var b = new Buffer(hash);
        var refresh_token = b.toString("base64");
        res.status(201).send({
          token: token,
          refreshToken: refresh_token,
          userId: req.body.userId,
          email: req.body.email,
          fullname: req.body.name
        });
      } catch (err) {
        res.status(500).send({ errors: err });
      }
    }
  }]);

  return AuthorizationController;
}();

exports.default = AuthorizationController;