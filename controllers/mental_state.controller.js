import { MongoClient, ObjectId } from "mongodb";
import MentalState from "../models/mental_state.model";

const uri =
  "mongodb+srv://moodyApi:nsusga06@cluster0-b4mio.gcp.mongodb.net/test?retryWrites=true&w=majority";

class MentalStateController {
  static test(req, res) {
    res.send("Greetings from the Test controller!");
  }

  static async create(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    await client.connect();
    console.log("connected");
    const db = client.db("moodyDb");
    let mental_state = {
      rating: parseInt(req.body.rating),
      mood_type: parseInt(req.body.mood_type_id),
      date_created: new Date().getTime(),
      user: parseInt(req.body.user_id),
      notes: req.body.notes
    };
    console.log(mental_state);
    db.collection("MentalState").insertOne(mental_state, (err, result) => {
      if (err) throw err;
      console.log("results are = ", result);
      res.sendStatus(200);
    });
  }

  static read(req, res) {}

  static update(req, res) {}

  static delete(req, res) {}
}

export default MentalStateController;
