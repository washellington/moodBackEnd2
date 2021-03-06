import { MongoClient, ObjectId } from "mongodb";
import MentalState from "../models/mental_state.model";
import moment from "moment";

const uri = process.env.MONGODB_CONNECTION_STRING;

const COLLECTION = "MentalState";

class MentalStateController {
  static test(req, res) {
    res.send("Greetings from the Test controller!");
  }

  static async create(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    await client.connect();
    console.log("create: connected");
    const db = client.db("moodyDb");
    let model = {
      rating: parseInt(req.body.rating),
      mood_type: req.body.mood_type,
      date_created: new Date().getTime(),
      user: req.userId,
      notes: req.body.notes,
      entry_date: req.body.entry_date
    };
    console.log(model);
    db.collection(COLLECTION).insertOne(model, (err, result) => {
      if (err) {
        res.status(500).send({
          err: "Could not create entry"
        });
      } else {
        console.log("results are = ", result);
        res.sendStatus(200);
      }
    });
  }

  static async read(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
      await client.connect();
      console.log("read: connected");
    } catch (e) {
      console.error(e);
    }
    const db = client.db("moodyDb");
    let id = req.params.id;

    let model = await db.collection(COLLECTION).findOne({ _id: ObjectId(id) });

    if (model) {
      console.log("found mental_state:", model);
      res.sendStatus(200);
    } else {
      console.warn("could not find model with id: ", id);
      res.status(500).send({
        err: "Can not find entry"
      });
    }
  }

  static async recent(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    await client.connect();
    console.log("recent: connected");
    const db = client.db("moodyDb");
    console.log(req.userId, req.query.mood_type_id);
    db.collection(COLLECTION)
      .find(
        { user: req.userId, mood_type: req.query.mood_type_id },
        { limit: 5 }
      )
      .sort({ entry_date: -1 })
      .toArray((error, results) => {
        console.log(error, results);
        let models = results;
        if (models) {
          console.log("results are = ", models);
        } else {
          console.log("could not find any models");
        }
        if (error) {
          console.warn(error);
          res.status(500).send({
            err: "Could not find any recent entries"
          });
        } else {
          res.status(200).send(models);
          console.log("mental state recent entries are:", models);
        }
      });
  }

  static async getMonthEntries(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    await client.connect();
    console.log("getMonthEntries: connected");
    const db = client.db("moodyDb");
    console.log(req.userId, req.query.mood_type_id);
    db.collection(COLLECTION)
      .find({
        user: req.userId,
        mood_type: req.query.mood_type_id,
        entry_date: {
          $gte: moment({ month: req.query.month, day: 1, year: req.query.year })
            .startOf("month")
            .valueOf(),
          $lte: moment({ month: req.query.month, day: 1, year: req.query.year })
            .endOf("month")
            .valueOf()
        }
      })
      .toArray((error, results) => {
        console.log(error, results);
        let models = results;
        if (error) {
          console.warn(error);
          res.status(500).send({
            err: "Could not get month entries"
          });
        } else {
          res.status(200).send({ mental_states: models });
          console.log("mental state by month entries are:", models);
        }
      });
  }

  static async overviewInformation(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    await client.connect();
    console.log("overviewInformation: connected");
    const db = client.db("moodyDb");
    let totalDays = 0;
    db.collection(COLLECTION)
      .find({ user: req.userId })
      .sort({ _id: 1 })
      .toArray((error, results) => {
        console.log("Sorted mental state = ", error, results);
        if (error) res.status(500).send(error);
        let firstDay = moment(results[0].entry_date);
        let lastDay = moment();
        totalDays = lastDay.diff(firstDay, "days") + 1;
        console.log("total days = ", totalDays);
        db.collection(COLLECTION).aggregate(
          [
            { $match: { user: req.userId } },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                averageMood: { $avg: "$rating" }
              }
            }
          ],
          (aggregateError, aggregateResults) => {
            if (aggregateError) {
              console.warn(aggregateErro);
              res.status(500).send({
                err: "Could not get overview information"
              });
            } else {
              aggregateResults.toArray().then(x => {
                console.log(x);
                let aggregateResults = x[0];
                res.status(200).send({
                  daysMissed: totalDays - aggregateResults.count,
                  averageMood: Math.round(aggregateResults.averageMood),
                  daysLogged: aggregateResults.count
                });
              });
            }
          }
        );
      });
  }

  static async update(req, res) {
    let model = {
      rating: parseInt(req.body.rating),
      mood_type: ObjectId(req.body.mood_type_id),
      date_created: new Date().getTime(),
      user: ObjectId(req.body.user_id),
      notes: req.body.notes
    };
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }
    const db = client.db("moodyDb");
    let id = req.params.id;

    let results = await db
      .collection(COLLECTION)
      .updateOne({ _id: ObjectId(id) }, { $set: model });

    console.log("updated mental_state result :", results);

    res.sendStatus(200);
  }

  static async delete(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }
    const db = client.db("moodyDb");
    let id = req.params.id;

    let results = await db
      .collection(COLLECTION)
      .deleteOne({ _id: ObjectId(id) });

    console.log("updated model result :", results);

    res.status(200).send(results);
  }
}

export default MentalStateController;
