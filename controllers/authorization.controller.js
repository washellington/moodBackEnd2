import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
export const jwtSecret = "jwtS3CR3TIsF1nallyHere";
class AuthorizationController {
  static login(req, res) {
    try {
      let refreshId = req.body.userId + jwtSecret;
      let salt = crypto.randomBytes(16).toString("base64");
      let hash = crypto
        .createHmac("sha512", salt)
        .update(refreshId)
        .digest("base64");
      req.body.refreshKey = salt;
      console.log(req.body);
      let token = jwt.sign(req.body, jwtSecret);
      let b = new Buffer(hash);
      let refresh_token = b.toString("base64");
      res.status(201).send({
        token,
        refreshToken: refresh_token,
        userId: req.body.userId
      });
    } catch (err) {
      res.status(500).send({ errors: err });
    }
  }
}

export default AuthorizationController;
