/**
 * Defines the schema for storing short URLs and exports the Mongoose model.
 */

const mongoose = require("mongoose");
const shortId = require("shortid");

// Schema for storing short URLs.
const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    // Generate unique short URL with shortid library.
    default: shortId.generate,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0, 
  },
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema); 
