const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/learning-website');

const noteSchema = new mongoose.Schema({
  heading: String,
  subheading: String,
  content: String,
  image: String,  // Image path
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }
});


  module.exports = mongoose.model('Note', noteSchema);