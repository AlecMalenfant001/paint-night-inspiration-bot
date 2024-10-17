//index.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./Routes/store")
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors()); 

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use("/api/store",authRoute)

app.listen(8800, () => {
  console.log("Backend is running");
});
