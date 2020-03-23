"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var express = _interopRequireWildcard(_express);

var _mental_state = require("../controllers/mental_state.controller");

var _mental_state2 = _interopRequireDefault(_mental_state);

var _verifyUser = require("../middleware/verify.user.middleware");

var _verifyUser2 = _interopRequireDefault(_verifyUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = express.Router();

// a simple test url to check that all of our files are communicating correctly.
router.get("/test", _mental_state2.default.test);

router.put("/", [_verifyUser2.default.validJWTNeeded, _mental_state2.default.create]);
router.get("/recent", [_verifyUser2.default.validJWTNeeded, _mental_state2.default.recent]);
router.get("/overview", [_verifyUser2.default.validJWTNeeded, _mental_state2.default.overviewInformation]);
router.get("/month", [_verifyUser2.default.validJWTNeeded, _mental_state2.default.getMonthEntries]);
router.get("/:id", _mental_state2.default.read);
router.post("/:id", _mental_state2.default.update);
router.delete("/:id", [_verifyUser2.default.validJWTNeeded, _mental_state2.default.delete]);

exports.default = router;