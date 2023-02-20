const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Visitor = require("./models/Visitor");

app.set("view engine", "pug");
app.set("views", "views");
app.use(express.urlencoded({ extended: false }));

mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.MONGODB_URL || "mongodb://localhost:27017/mongo-1",
  { useNewUrlParser: true }
);
mongoose.connection.on("connection", (e) => {
  console.log("Database connected");
});
mongoose.connection.off("error", (e) => {
  console.error(e);
});

app.get("/", async (req, res, next) => {
  const name = req.query.name ? req.query.name : "Anónimo";

  if (name === "Anónimo") {
    let data = {
      date: Date.now(),
      name: name,
      count: 1,
    };
    try {
      let visitorObject = new Visitor(data);
      await visitorObject.save();
    } catch (err) {
      console.log(err);
      return next(err);
    }
  } else {
    const visitorObject = await Visitor.findOne({ name: name });
    if (visitorObject) {
      visitorObject.count += 1;
      visitorObject.date = Date.now();
      try {
        let visitorObject = new Visitor(visitorObject);
        await visitorObject.save();
      } catch (err) {
        console.log(err);
        return next(err);
      }
    } else {
      let data = {
        date: Date.now(),
        name: name,
        count: 1,
      };
      try {
        let visitorObject = new Visitor(data);
        await visitorObject.save();
      } catch (err) {
        console.log(err);
        return next(err);
      }
    }
    let visitors = await Visitor.find();
    res.render("index", { visitors: visitors });
  }
});
