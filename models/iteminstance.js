var mongoose = require("mongoose");
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  // description: { type: String, required: true },
  price: { type: Number, required: true },
  section: { type: Schema.Types.ObjectId, ref: "Section", required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  stock: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
});

ItemSchema.virtual("url").get(function () {
  return "/item/" + this._id;
});

ItemSchema.virtual("expiryDateGet").get(function () {
  return DateTime.fromJSDate(this.expiryDate).toISODate();
});

ItemSchema.virtual("status").get(function () {
  const convertedDate = DateTime.fromJSDate(this.expiryDate).toISODate();
  const isExpiring = (date) => {
    const yearsExpiryDate = DateTime.fromFormat(date, "yyyy-mm-dd").diffNow(
      "years"
    ).years;
    const monthsExpiryDate = DateTime.fromFormat(date, "yyyy-mm-dd").diffNow(
      "months"
    ).months;
    const daysExpiryDate = DateTime.fromFormat(date, "yyyy-mm-dd").diffNow(
      "days"
    ).days;
    const totalDaysDelta =
      yearsExpiryDate * 365 + monthsExpiryDate * 30 + daysExpiryDate;
    if (totalDaysDelta < 30) return "danger";
    else if (totalDaysDelta < 60) return "warning";
    else return "good";
  };
  return isExpiring(convertedDate);
});

module.exports = mongoose.model("Item", ItemSchema);
