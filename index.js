import express from "express";
import UserRoute from "./routes/user.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/users", UserRoute);

let port = 1234;
app.listen(port, () => {
  console.log("Server is up and running on port numner " + port);
});
