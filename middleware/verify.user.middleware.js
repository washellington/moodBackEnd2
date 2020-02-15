import * as crypto from "crypto";
import { MongoClient, ObjectId, $set } from "mongodb";
import { jwtSecret } from "../controllers/authorization.controller";
import * as jwt from "jsonwebtoken";

const uri =
  "mongodb+srv://moodyApi:nsusga06@cluster0-b4mio.gcp.mongodb.net/test?retryWrites=true&w=majority";

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
              .sendStatus(400)
              .send({ errors: ["Invalid email or password"] });
          }
        }
      });
  }

  static validJWTNeeded(req, res, next) {
    if (req.headers["authorization"]) {
      try {
        let authorization = req.headers["authorization"].split(" ");
        if (authorization[0] !== "Bearer") {
          return res.status(401).send();
        } else {
          req.jwt = jwt.verify(authorization[1], jwtSecret);
          req.userId = jwt.userId;
          return next();
        }
      } catch (err) {
        return res.status(403).send();
      }
    } else {
      return res.status(401).send();
    }
  }
}
