import express from "express";
import UserRoute from "./routes/user.route";
import MentalStateRoute from "./routes/mental_state.route";
import MoodTypeRoute from "./routes/mood_type.route";
import AuthorizationRoute from "./routes/authorization.route";
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/users", UserRoute);
app.use("/mental_state", MentalStateRoute);
app.use("/mood_type", MoodTypeRoute);
app.use("/authorization", AuthorizationRoute);

let port = 1234;
app.listen(port, () => {
  console.log("Server is up and running on port numner " + port);
});
