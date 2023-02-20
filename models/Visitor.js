const mongoose = require("mongoose");

var schemaObject = mongoose.Schema({
  count: { type: Number, default: 1 },
  name: String,
  date: Date,
});

module.exports = mongoose.model("Visitor", schemaObject);
