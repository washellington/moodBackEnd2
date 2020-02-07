import express from "express";
import UserRoute from "./routes/user.route";
import MentalStateRoute from "./routes/mental_state.route";
import MoodTypeRoute from "./routes/mood_type.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/users", UserRoute);
app.use("/mental_state", MentalStateRoute);
app.use("/mood_type", MoodTypeRoute);

let port = 1234;
app.listen(port, () => {
  console.log("Server is up and running on port numner " + port);
});
