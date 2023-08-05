/**
 * This file serves as the main server script for the application
 * that sets up the Express server, connects to MongoDB, defines routes, and handles incoming requests.
 */

const express = require("express");
const res = require("express/lib/response");
const mongoose = require("mongoose"); 
const app = express();
const path = require('path');

const ShortUrl = require("./models/shortUrl");

mongoose
  // DB_URL is defined in docker-compose.yml.
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected!"));
  
mongoose.connection.on("error", (error) => {
   console.log("Error connecting to MongoDB:", error);
 });

 mongoose.connection.on("disconnected", () => {
   console.log("Disconnected from MongoDB");
 });

app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "ejs"); 

// // Middleware to parse URL-encoded form data and reserve special characters for sending data
app.use(express.urlencoded({ extended: false }));

// Render the index view with the shortUrls object.
app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
  // res.send("Hi")
});

// Create a new ShortUrl object and redirect to the index view.
app.post("/shortUrls", async (req, res) => {
  // Create a new ShortUrl Obj in the database with the provided full URL from the request body
  await ShortUrl.create({ full: req.body.fullURL });
  res.redirect("/");
});

// Find the record in ShortUrl that has the same short name as the URL.
app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 3000);
module.exports = app
