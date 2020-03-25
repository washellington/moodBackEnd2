import User from "../models/user.model";
import PasswordRecovery from "../models/password_recovery.model";
import * as crypto from "crypto";
import { MongoClient, ObjectId, $set } from "mongodb";
import MentalStateController from "./mental_state.controller";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const sgMail = require("@sendgrid/mail");

const uri = process.env.MONGODB_CONNECTION_STRING;

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
      firstName: req.body.first_name || "",
      lastName: req.body.last_name || ""
    };
    console.log(user);
    user.salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", user.salt)
      .update(user.password)
      .digest("base64");
    console.log(hash);
    user.password = hash;
    db.collection("User").insertOne(user, (err, result) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        console.log("results are = ", result);
        res.sendStatus(200);
      }
    });
  }

  static async reset_password(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    await client.connect();
    const db = client.db("moodyDb");
    let reset_password = {
      email: req.body.email,
      password: req.body.password,
      token: req.body.token
    };

    let passwordRecoveryResults = await db
      .collection("PasswordRecovery")
      .find({ email: reset_password.email })
      .sort({ expiration_date: -1 })
      .toArray();
    console.log(passwordRecoveryResults[0]);

    let recoveryHash = crypto
      .createHmac("sha512", reset_password.email)
      .update(reset_password.token)
      .digest("base64");

    if (passwordRecoveryResults[0].hashed_token != recoveryHash) {
      res.status(500).send({
        err: "Could not validate token"
      });
      return;
    }
    if (Date.now() > passwordRecoveryResults[0].expiration_date) {
      res.status(500).send({
        err: "Token expired"
      });
      return;
    }
    let newPassword = {};
    newPassword.salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", newPassword.salt)
      .update(reset_password.password)
      .digest("base64");
    newPassword.password = hash;
    db.collection("User").updateOne(
      { email: reset_password.email },
      { $set: newPassword },
      {},
      (err, results) => {
        if (err) {
          res.status(500).send({
            err: "Could not update password"
          });
        } else {
          res.sendStatus(200);
        }
      }
    );
  }

  static async read(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }
    const db = client.db("moodyDb");
    let id = req.params.id || req.userId;

    let user = await db.collection("User").findOne({ _id: ObjectId(id) });

    if (user) {
      console.log("found user:", user);
    } else {
      console.warn("could not find user with id: ", id);
    }
    res.status(200).send({
      userId: user._id,
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`
    });
  }

  static async recover_account(req, res) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }
    const db = client.db("moodyDb");
    let email = req.body.email;

    let user = await db.collection("User").findOne({ email: email });

    if (user) {
      console.log("found user:", user);
      let token = uuidv4();
      let hash = crypto
        .createHmac("sha512", email)
        .update(token)
        .digest("base64");
      console.log(hash);
      let date_requested = new Date();
      let password_recovery = {
        email,
        hashed_token: hash,
        date_requested: date_requested.getTime(),
        expiration_date: moment(date_requested)
          .add(10, "minute")
          .valueOf()
      };
      db.collection("PasswordRecovery").insertOne(
        password_recovery,
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send({
              err
            });
          } else {
            console.log("results are = ", result);
            //send email with token
            UserController.sendEmail(email, token);
            res.sendStatus(200);
          }
        }
      );
    } else {
      console.warn("could not find user with emai: ", email);
      res.status(500).send({
        err: "Could not find requested user"
      });
    }
  }

  static info(req, res) {
    console.log(req.userId, req.jwt);
    //res.send({ userId: req.userId });
    UserController.read(req, res);
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

  static sendEmail(email, token) {
    sgMail.setApiKey(process.env.SENDGRID_API);
    const msg = {
      to: process.env.MOODY_ENV == "prod" ? email : process.env.DEV_EMAIL,
      from: process.env.SUPPORT_EMAIL_ADDRESS,
      subject: "Reset Password Request",
      text: `Here is the link to reset your password. Note that the link will expire in 10 minutes. ${UserController.generateLink(
        token
      )}`,
      html: `Here is the link to reset your password. 
      <br>
      <strong>Note that the link will expire in 10 minutes.</strong>
      <br>
      <a href='${UserController.generateLink(token)}'>Reset Password</a>`
    };
    sgMail.send(msg);
  }

  static generateLink(token) {
    if (process.env.MOODY_ENV == "prod") {
      return `moody.theconsciousobserver.com/reset_password?token=${token}`;
    } else {
      return `http://localhost:3000/reset_password?token=${token}`;
    }
  }
}
export default UserController;
