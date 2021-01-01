var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SectionSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
});

SectionSchema.virtual("url").get(function () {
  return "/section/" + this._id;
});

module.exports = mongoose.model("Section", SectionSchema);
