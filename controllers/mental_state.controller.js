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
      mood_type: parseInt(req.body.mood_type_id),
      date_created: new Date().getTime(),
      user: parseInt(req.body.user_id),
      notes: req.body.notes
    };
    console.log(model);
    db.collection(COLLECTION).insertOne(model, (err, result) => {
      if (err) throw err;
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

    let user = await db.collection(COLLECTION).findOne({ _id: ObjectId(id) });

    if (user) {
      console.log("found mental_state:", user);
    } else {
      console.warn("could not find user with id: ", id);
    }
    res.sendStatus(200);
  }

  static async update(req, res) {
    let model = {
      rating: parseInt(req.body.rating),
      mood_type: parseInt(req.body.mood_type_id),
      date_created: new Date().getTime(),
      user: parseInt(req.body.user_id),
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

    console.log("updated user result :", results);

    res.sendStatus(200);
  }
}

export default MentalStateController;
