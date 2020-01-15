"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var express = _interopRequireWildcard(_express);

var _user = require("../controllers/user.controller");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = express.Router();

// a simple test url to check that all of our files are communicating correctly.
router.get("/test", _user2.default.test);

router.post("/create", _user2.default.create);
// router.get("/read", UserController.read);
// router.post("/update", UserController.update);
// router.delete("/delete", UserController.delete);

exports.default = router;