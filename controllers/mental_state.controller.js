import { MongoClient, ObjectId } from "mongodb";
import MentalState from "../models/mental_state.model";

const uri =
  "mongodb+srv://moodyApi:nsusga06@cluster0-b4mio.gcp.mongodb.net/test?retryWrites=true&w=majority";

const COLLECTION = "MentalState";

class MentalStateController {
  static test(req, res) {
    res.send("Greetings from the Test controller!");
  }

  static async create(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    await client.connect();
    console.log("connected");
    const db = client.db("moodyDb");
    let model = {
      rating: parseInt(req.body.rating),
      mood_type: req.body.mood_type,
      date_created: new Date().getTime(),
      user: req.body.user,
      notes: req.body.notes,
      entry_date: req.body.entry_date
    };
    console.log(model);
    db.collection(COLLECTION).insertOne(model, (err, result) => {
      if (err) res.status(500).send(err);
      console.log("results are = ", result);
      res.sendStatus(200);
    });
  }
  static async read(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }
    const db = client.db("moodyDb");
    let id = req.params.id;

    let model = await db.collection(COLLECTION).findOne({ _id: ObjectId(id) });

    if (model) {
      console.log("found mental_state:", model);
    } else {
      console.warn("could not find model with id: ", id);
    }
    res.sendStatus(200);
  }

  static async recent(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    await client.connect();
    console.log("connected");
    const db = client.db("moodyDb");
    console.log(req.userId, req.query.mood_type_id);
    db.collection(COLLECTION)
      .find(
        { user: req.userId, mood_type: req.query.mood_type_id },
        { limit: 5 }
      )
      .sort({
        entry_date: 1
      })
      .toArray((error, results) => {
        console.log(error, results);
        let models = results;
        if (models) {
          console.log("results are = ", models);
        } else {
          console.log("could not find any models");
        }
        if (error) res.status(500).send(error);
        else res.status(200).send(models);
        console.log("mental state recent entries are:", models);
      });
  }

  static async overviewInformation(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    await client.connect();
    console.log("connected");
    const db = client.db("moodyDb");
    console.log(req.userId, req.query.mood_type_id);
    db.collection(COLLECTION)
      .find(
        { user: req.userId, mood_type: req.query.mood_type_id },
        { limit: 10 }
      )
      .sort({
        entry_date: 1
      })
      .toArray((error, results) => {
        console.log(error, results);
        let models = results;
        if (models) {
          console.log("results are = ", models);
        } else {
          console.log("could not find any models");
        }
        if (error) res.status(500).send(error);
        else res.status(200).send(models);
        console.log("mental state recent entries are:", models);
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

    res.sendStatus(200);
  }
}

export default MentalStateController;
