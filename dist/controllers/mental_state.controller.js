"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongodb = require("mongodb");

var _mental_state = require("../models/mental_state.model");

var _mental_state2 = _interopRequireDefault(_mental_state);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uri = "mongodb+srv://moodyApi:nsusga06@cluster0-b4mio.gcp.mongodb.net/test?retryWrites=true&w=majority";

var COLLECTION = "MentalState";

var MentalStateController = function () {
  function MentalStateController() {
    _classCallCheck(this, MentalStateController);
  }

  _createClass(MentalStateController, null, [{
    key: "test",
    value: function test(req, res) {
      res.send("Greetings from the Test controller!");
    }
  }, {
    key: "create",
    value: async function create(req, res) {
      var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

      await client.connect();
      console.log("create: connected");
      var db = client.db("moodyDb");
      var model = {
        rating: parseInt(req.body.rating),
        mood_type: req.body.mood_type,
        date_created: new Date().getTime(),
        user: req.userId,
        notes: req.body.notes,
        entry_date: req.body.entry_date
      };
      console.log(model);
      db.collection(COLLECTION).insertOne(model, function (err, result) {
        if (err) res.status(500).send(err);
        console.log("results are = ", result);
        res.sendStatus(200);
      });
    }
  }, {
    key: "read",
    value: async function read(req, res) {
      var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

      try {
        await client.connect();
        console.log("read: connected");
      } catch (e) {
        console.error(e);
      }
      var db = client.db("moodyDb");
      var id = req.params.id;

      var model = await db.collection(COLLECTION).findOne({ _id: (0, _mongodb.ObjectId)(id) });

      if (model) {
        console.log("found mental_state:", model);
      } else {
        console.warn("could not find model with id: ", id);
      }
      res.sendStatus(200);
    }
  }, {
    key: "recent",
    value: async function recent(req, res) {
      var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

      await client.connect();
      console.log("recent: connected");
      var db = client.db("moodyDb");
      console.log(req.userId, req.query.mood_type_id);
      db.collection(COLLECTION).find({ user: req.userId, mood_type: req.query.mood_type_id }, { limit: 5 }).sort({ entry_date: -1 }).toArray(function (error, results) {
        console.log(error, results);
        var models = results;
        if (models) {
          console.log("results are = ", models);
        } else {
          console.log("could not find any models");
        }
        if (error) res.status(500).send(error);else res.status(200).send(models);
        console.log("mental state recent entries are:", models);
      });
    }
  }, {
    key: "getMonthEntries",
    value: async function getMonthEntries(req, res) {
      var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

      await client.connect();
      console.log("getMonthEntries: connected");
      var db = client.db("moodyDb");
      console.log(req.userId, req.query.mood_type_id);
      db.collection(COLLECTION).find({
        user: req.userId,
        mood_type: req.query.mood_type_id,
        entry_date: {
          $gte: (0, _moment2.default)({ month: req.query.month, day: 1, year: req.query.year }).startOf("month").valueOf(),
          $lte: (0, _moment2.default)({ month: req.query.month, day: 1, year: req.query.year }).endOf("month").valueOf()
        }
      }).toArray(function (error, results) {
        console.log(error, results);
        var models = results;
        if (error) res.status(500).send(error);else res.status(200).send({ mental_states: models });
        console.log("mental state by month entries are:", models);
      });
    }
  }, {
    key: "overviewInformation",
    value: async function overviewInformation(req, res) {
      var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

      await client.connect();
      console.log("overviewInformation: connected");
      var db = client.db("moodyDb");
      var totalDays = 0;
      db.collection(COLLECTION).find({ user: req.userId }).sort({ _id: 1 }).toArray(function (error, results) {
        console.log("Sorted mental state = ", error, results);
        if (error) res.status(500).send(error);
        var firstDay = (0, _moment2.default)(results[0].entry_date);
        var lastDay = (0, _moment2.default)();
        totalDays = lastDay.diff(firstDay, "days") + 1;
        console.log("total days = ", totalDays);
        db.collection(COLLECTION).aggregate([{ $match: { user: req.userId } }, {
          $group: {
            _id: null,
            count: { $sum: 1 },
            averageMood: { $avg: "$rating" }
          }
        }], function (aggregateError, aggregateResults) {
          if (aggregateError) res.status(500).send(aggregateError);
          aggregateResults.toArray().then(function (x) {
            console.log(x);
            var aggregateResults = x[0];
            res.status(200).send({
              daysMissed: totalDays - aggregateResults.count,
              averageMood: Math.round(aggregateResults.averageMood),
              daysLogged: aggregateResults.count
            });
          });
        });
      });
    }
  }, {
    key: "update",
    value: async function update(req, res) {
      var model = {
        rating: parseInt(req.body.rating),
        mood_type: (0, _mongodb.ObjectId)(req.body.mood_type_id),
        date_created: new Date().getTime(),
        user: (0, _mongodb.ObjectId)(req.body.user_id),
        notes: req.body.notes
      };
      var client = new _mongodb.MongoClient(uri, { useUnifiedTopology: true });

      try {
        await client.connect();
      } catch (e) {
        console.error(e);
      }
      var db = client.db("moodyDb");
      var id = req.params.id;

      var results = await db.collection(COLLECTION).updateOne({ _id: (0, _mongodb.ObjectId)(id) }, { $set: model });

      console.log("updated mental_state result :", results);

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

      var results = await db.collection(COLLECTION).deleteOne({ _id: (0, _mongodb.ObjectId)(id) });

      console.log("updated model result :", results);

      res.status(200).send(results);
    }
  }]);

  return MentalStateController;
}();

exports.default = MentalStateController;