
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  name:{type:String,required: true},
  prompt: { type: String, required: true },
  imgUrl: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Image", ImageSchema);