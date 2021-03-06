import { MongoClient, ObjectId } from "mongodb";
import MoodType from "../models/mood_type.model";

const uri = process.env.MONGODB_CONNECTION_STRING;

const COLLECTION = "MoodType";

class MoodTypeController {
  static test(req, res) {
    res.send("Greetings from the Test controller!");
  }

  static async index(req, res) {
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
    let models = db.collection(COLLECTION).find();

    if (models) {
      console.log("results are = ", models);
      res.sendStatus(200);
    } else {
      console.log("could not find any models");

      res.status(500).send({
        err: "Could not find any models"
      });
    }
  }

  static async getDefault(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    await client.connect();
    console.log("connected");
    const db = client.db("moodyDb");

    let model = await db
      .collection(COLLECTION)
      .findOne({ mood_type: "emotion" });

    if (model) {
      console.log("results are = ", model);
      res.status(200).send(model);
    } else {
      console.log("could not find any models");
      res.status(500).send({ err: "Could not find default mood type" });
    }
  }
}

export default MoodTypeController;
