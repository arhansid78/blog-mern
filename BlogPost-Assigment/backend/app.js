const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/user-routes");
const dotenv = require("dotenv");
dotenv.config();
const connectToDb = require("./config/db");
connectToDb();
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
