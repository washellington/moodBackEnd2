import * as crypto from "crypto";
import { MongoClient, ObjectId, $set } from "mongodb";

const uri =
  "mongodb+srv://moodyApi:nsusga06@cluster0-b4mio.gcp.mongodb.net/test?retryWrites=true&w=majority";

export default class VerifyUserMiddleware {
  static async isPasswordAndUserMatch(req, res, next) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }
    const db = client.db("moodyDb");

    db.collection("User")
      .findOne({ email: req.body.email })
      .catch(err => {
        console.warn(err);
      })
      .then(user => {
        if (!user || !user.length()) {
          res.sendStatus(404);
          console.warn("user not found");
        } else {
          let user = user[0];
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
}
