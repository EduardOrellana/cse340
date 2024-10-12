const express = require("express")
const router = new express.Router()
const utility = require("../utilities/index")
const accountController = require("../controllers/accountController")

router.get("/login", utility.handleErrors(accountController.buildLogin))


module.exports = router;