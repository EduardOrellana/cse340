// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
//:classificationId es un parametro.se captura desde la URl
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;

