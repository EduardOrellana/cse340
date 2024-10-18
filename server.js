/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const pool = require('./database/');
const utilities = require("./utilities/index");
const staticRoutes = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const loginRoute = require("./routes/accountRoute");
const baseController = require("./controllers/baseController");
const cookieParser = require("cookie-parser")

/* ***********************
 * App Initialization
 *************************/
const app = express();

/* ***********************
 * Middleware Configuration
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Cookier Parseer
app.use(cookieParser())

// Session middleware
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Flash messages middleware
app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

/* ***********************
 * Routes Configuration
 *************************/
app.use(staticRoutes);
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.use("/account", loginRoute);

/* ***********************
 * File Not Found Route
 *************************/
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'});
});

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.stack || err.message}`);
  
  res.status(err.status || 500);

  const errorMessage = err.status === 500
    ? "Something is wrong with the server, please try again later."
    : err.message || "Unexpected error occurred.";

  res.render("./errors/error.ejs", {  
    title: err.status || 'Server Error',
    message: errorMessage,
    nav,
  });
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Start the Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
