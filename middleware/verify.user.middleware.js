import * as crypto from "crypto";
import { MongoClient, ObjectId, $set } from "mongodb";
import { jwtSecret } from "../controllers/authorization.controller";
import * as jwt from "jsonwebtoken";

const uri = process.env.MONGODB_CONNECTION_STRING;

export default class VerifyUserMiddleware {
  static async isPasswordAndUserMatch(req, res, next) {
    const client = new MongoClient(uri, {
      useUnifiedTopology: true
    });
    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }
    const db = client.db("moodyDb");

    db.collection("User")
      .findOne({ email: req.body.email })
      .then(user => {
        console.log(`User = `, user);

        if (!user) {
          res.sendStatus(204);
        } else {
          let password = user.password;
          let salt = user.salt;
          let hash = crypto
            .createHmac("sha512", salt)
            .update(req.body.password)
            .digest("base64");
          if (hash == password) {
            req.body = {
              userId: user._id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`
            };

            return next();
          } else {
            return res
              .status(400)
              .send({ errors: ["Invalid email or password"] });
          }
        }
      });
  }

  static validJWTNeeded(req, res, next) {
    console.log("validJWTNeeded");
    if (req.headers["authorization"]) {
      try {
        let authorization = req.headers["authorization"].split(" ");
        if (authorization[0] !== "Bearer") {
          return res.status(401).send();
        } else {
          req.jwt = jwt.verify(authorization[1], jwtSecret);
          req.userId = req.jwt.userId;
          return next();
        }
      } catch (err) {
        return res.status(403).send({ err: "Username could not be validated" });
      }
    } else {
      return res.status(401).send();
    }
  }
}
