const express = require("express");
const app = express();
const mongoose = require("mongoose");

const Visitor = require("./models/Visitor");
app.set("view engine", "pug");
app.set("views", "views");
app.use(express.urlencoded({ extended: true }));

mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.MONGODB_URL || "mongodb://localhost:27017/mongo-1",
  { useNewUrlParser: true }
);
mongoose.connection.on("error", function (e) {
  console.error(e);
});

app.get("/", async (req, res, next) => {
  const name = !req.query.name ? "Anónimo" : req.query.name;

  if (name === "Anónimo") {
    const data = {
      name: name,
      count: 1,
    };
    try {
      const visitor = new Visitor(data);
      await visitor.save();
    } catch (e) {
      return next(e);
    }
  } else {
    const visitor = await Visitor.findOne({ name: name });
    if (visitor) {
      visitor.count += 1;
      try {
        await visitor.save({});
      } catch (e) {
        return next(e);
      }
    } else {
      const data = { name: name, count: 1 };
      try {
        const visitor = new Visitor(data);
        await visitor.save();
      } catch (e) {
        return next(e);
      }
    }
  }
  const visitors = await Visitor.find();
  res.render("index", { visitors: visitors });
});

app.listen(3000, () => console.log("Listening on port 3000!"));
