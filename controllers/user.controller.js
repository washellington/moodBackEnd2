import User from "../models/user.model";
import * as crypto from "crypto";
import { MongoClient, ObjectId, $set } from "mongodb";

const uri =
  "mongodb+srv://moodyApi:WAS&amr13@cluster0-jndzm.gcp.mongodb.net/test?retryWrites=true&w=majority";

//Simple version, without validation or sanitation

class UserController {
  static test(req, res) {
    res.send("Greetings from the Test controller!");
  }
  static async create(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    await client.connect();
    const db = client.db("moodyDb");
    let user = {
      email: req.body.email,
      password: req.body.password,
      salt: "",
      firstName: req.body.first_name,
      lastName: req.body.last_name
    };
    user.salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", user.salt)
      .update(user.password)
      .digest("base64");
    user.password = hash;
    db.collection("User").insertOne(user, (err, result) => {
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

    let user = await db.collection("User").findOne({ _id: ObjectId(id) });

    if (user) {
      console.log("found user:", user);
    } else {
      console.warn("could not find user with id: ", id);
    }
    res.sendStatus(200);
  }

  static async update(req, res) {
    let userParams = {
      firstName: req.body.first_name,
      lastName: req.body.last_name
    };
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }
    const db = client.db("moodyDb");
    let id = req.params.id;

    let userResult = await db
      .collection("User")
      .updateOne({ _id: ObjectId(id) }, { $set: userParams });

    console.log("updated user result :", userResult);

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

    let userResult = await db
      .collection("User")
      .deleteOne({ _id: ObjectId(id) });

    console.log("updated user result :", userResult);

    res.sendStatus(200);
  }
}
export default UserController;
