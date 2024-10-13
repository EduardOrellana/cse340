// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utility = require("../utilities/index")
const carValidation = require("../controllers/invController")

/* **********************
 * Route Definitions
 ************************/

// Management View Route (Main Inventory Management Page)
router.get("/", utility.handleErrors(invController.manage))

// Route to display vehicles by classification ID
// ":classificationId" es un parámetro de ruta que captura el ID de clasificación desde la URL.
router.get("/type/:classificationId", utility.handleErrors(invController.buildByClassificationId))

// Route to display vehicle details by car ID
router.get("/detail/:car_Id", utility.handleErrors(invController.informationCarId))

// Route to display the form to add a new car
router.get("/addingCar", utility.handleErrors(invController.showAddCarForm)) // <- Asigna un controlador aquí

// Route to display the form to add a new classification
router.get("/addingClassification", utility.handleErrors(invController.form_management)) // <- Asigna un controlador aquí

// Route to add a new Classification Car
router.post("/addingClassification",
    carValidation.registrationRules(),
    carValidation.checkClassfication,
    utility.handleErrors(invController.form_management)
)

module.exports = router
