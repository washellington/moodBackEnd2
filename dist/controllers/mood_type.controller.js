"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongodb = require("mongodb");

var _mood_type = require("../models/mood_type.model");

var _mood_type2 = _interopRequireDefault(_mood_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uri = "mongodb+srv://moodyApi:nsusga06@cluster0-b4mio.gcp.mongodb.net/test?retryWrites=true&w=majority";

var COLLECTION = "MoodType";

var MoodTypeController = function () {
  function MoodTypeController() {
    _classCallCheck(this, MoodTypeController);
  }

  _createClass(MoodTypeController, null, [{
    key: "test",
    value: function test(req, res) {
      res.send("Greetings from the Test controller!");
    }
  }, {
    key: "index",
    value: async function index(req, res) {
      var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

      await client.connect();
      console.log("connected");
      var db = client.db("moodyDb");
      var model = {
        rating: parseInt(req.body.rating),
        mood_type: parseInt(req.body.mood_type_id),
        date_created: new Date().getTime(),
        user: parseInt(req.body.user_id),
        notes: req.body.notes
      };
      console.log(model);
      var models = db.collection(COLLECTION).find();

      if (models) {
        console.log("results are = ", models);
      } else {
        console.log("could not find any models");
      }
      res.sendStatus(200);
    }
  }, {
    key: "getDefault",
    value: async function getDefault(req, res) {
      var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

      await client.connect();
      console.log("connected");
      var db = client.db("moodyDb");

      var model = await db.collection(COLLECTION).findOne({ mood_type: "emotion" });

      if (model) {
        console.log("results are = ", model);
        res.status(200).send(model);
      } else {
        console.log("could not find any models");
        res.status(200).send({ err: "Could not find default mood type" });
      }
    }
  }]);

  return MoodTypeController;
}();

exports.default = MoodTypeController;