"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var express = _interopRequireWildcard(_express);

var _verifyUser = require("../middleware/verify.user.middleware");

var _verifyUser2 = _interopRequireDefault(_verifyUser);

var _user = require("../controllers/user.controller");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = express.Router();

// a simple test url to check that all of our files are communicating correctly.
router.get("/test", _user2.default.test);

router.put("/", _user2.default.create);
router.post("/recover_account", _user2.default.recover_account);
router.put("/reset_password", _user2.default.reset_password);
router.get("/info", [_verifyUser2.default.validJWTNeeded, _user2.default.info]);
router.get("/:id", [_verifyUser2.default.validJWTNeeded, _user2.default.read]);
router.post("/:id", _user2.default.update);
router.delete("/:id", _user2.default.delete);

exports.default = router;