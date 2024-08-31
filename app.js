const express = require("express");

const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const { checkUser, requireAuth } = require("./middlewares/auth.middleware");
const dotent = require("dotenv").config();
const app = express();
require("./config/db");

const port = process.env.PORT;

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// jwt

app.get("*", checkUser);
app.get("/jwtid", requireAuth, async (req, res) => {
  await res.status(200).send(res.locals.user.id);
});

app.use("/api/user", userRoutes);

app.listen(port, () => console.log("serveur lancer sur le port " + port));
