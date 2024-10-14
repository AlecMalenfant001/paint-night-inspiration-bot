const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//create route for backend api
app.get("/api", (req, res) => {
  res.json({ fruits: ["Alec, Alex, Lili, Reagan, Troye Sivane"] });
});

//run the server
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
