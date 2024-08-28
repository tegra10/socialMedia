const express = require("express");

const userRoutes = require("./routes/user.routes");
const dotent = require("dotenv").config();
const app = express();
require("./config/db");

const port = process.env.PORT;

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRoutes);

app.listen(port, () => console.log("serveur lancer sur le port " + port));
