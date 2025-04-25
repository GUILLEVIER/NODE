const mongoose = require("mongoose");
const scoresSchema = mongoose.Schema({
  homeTeam: {
    type: String,
    required: true,
  },
  visitTeam: {
    type: String,
    required: true,
  },
  scoreHome: {
    type: Number,
    required: true,
  },
  scoreVisit: {
    type: Number,
    required: true,
  },
  foulsHome: {
    type: Number,
    required: true,
  },
  foulsVisit: {
    type: Number,
    required: true,
  },
  timeoutsHome: {
    type: Number,
    required: true,
  },
  timeoutsVisit: {
    type: Number,
    required: true,
  },
  period: {
    type: Number,
    required: true,
  },
  dateCreation: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("scores", scoresSchema);
