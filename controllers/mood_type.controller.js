import { MongoClient, ObjectId } from "mongodb";
import MoodType from "../models/mood_type.model";

const uri =
  "mongodb+srv://moodyApi:nsusga06@cluster0-b4mio.gcp.mongodb.net/test?retryWrites=true&w=majority";

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
    } else {
      console.log("could not find any models");
    }
    res.sendStatus(200);
  }
}

export default MoodTypeController;
