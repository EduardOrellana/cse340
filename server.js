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
const app = express();
const static = require("./routes/static");
//adding the inventory route.
const inventoryRoute = require("./routes/inventoryRoute");
//adding the login route
const loginRoute = require("./routes/accountRoute");

//adding the controller
const baseController = require("./controllers/baseController");
const utilities = require("./utilities/index"); //to get the error handle.
//adding sessions controllers 
const session = require("express-session")
const pool = require('./database/')

//the option to charge the layouts.
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Middleware Session
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * Routes
 *************************/
// Index route
// app.get("/", function(req, res){
//   res.render("index", {title: "Home"})
// })
app.use(static);
//Inventory Controller
//app.get("/", utilities.handleErrors(baseController.buildHome))
app.get("/", utilities.handleErrors(baseController.buildHome))

app.use("/inv", inventoryRoute);

//login route
app.use("/account", loginRoute)


// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middlewar e
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.stack || err.message}`);
  
  res.status(err.status || 500);

  if (err.status === 500){
    errorMessage = "Something is wrong with the server, please try again later."
  } else {
    errorMessage = err.message || "Unexpected error occurred."
  };

  res.render("./errors/error.ejs", {  
      title: err.status || 'Server Error',
      message: errorMessage,
      nav
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
