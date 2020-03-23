"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var express = _interopRequireWildcard(_express);

var _authorization = require("../controllers/authorization.controller");

var _authorization2 = _interopRequireDefault(_authorization);

var _verifyUser = require("../middleware/verify.user.middleware");

var _verifyUser2 = _interopRequireDefault(_verifyUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = express.Router();

router.post("/auth", [
//VerifyUserMiddleware.hasAuthValidFields,
_verifyUser2.default.isPasswordAndUserMatch, _authorization2.default.login]);

exports.default = router;