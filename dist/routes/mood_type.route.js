"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var express = _interopRequireWildcard(_express);

var _mood_type = require("../controllers/mood_type.controller");

var _mood_type2 = _interopRequireDefault(_mood_type);

var _verifyUser = require("../middleware/verify.user.middleware");

var _verifyUser2 = _interopRequireDefault(_verifyUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = express.Router();

// a simple test url to check that all of our files are communicating correctly.
router.get("/test", _mood_type2.default.test);

router.get("/", [_verifyUser2.default.validJWTNeeded, _mood_type2.default.index]);

router.get("/default", [_verifyUser2.default.validJWTNeeded, _mood_type2.default.getDefault]);

exports.default = router;