"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _user = require("./routes/user.route");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: false }));
app.use("/users", _user2.default);

var port = 1234;
app.listen(port, function () {
  console.log("Server is up and running on port numner " + port);
});