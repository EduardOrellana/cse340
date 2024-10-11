// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

const utility = require("../utilities/index")

// Route to build inventory by classification view
//:classificationId es un parametro.se captura desde la URl
router.get("/type/:classificationId", utility.handleErrors(invController.buildByClassificationId));
router.get("/detail/:car_Id", utility.handleErrors(invController.informationCarId));
// router.get("/detail/:car_Id", (req, res) => {
//     const id = req.params.car_Id;
//     res.send(`este es el id ${id}`)
// })


module.exports = router;

