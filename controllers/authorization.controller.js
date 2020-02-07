import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
const jwtSecret = "jwtS3CR3TIsF1nallyHere";
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
      let token = jwt.sign(req.body, jwtSecret);
      let b = new Buffer(hash);
      let refresh_token = b.toString("base64");
      res
        .sendStatus(201)
        .send({ accessToken: token, refreshToken: refresh_token });
    } catch (err) {
      res.sendStatus(500).send({ errors: err });
    }
  }
}

export default AuthorizationController;
