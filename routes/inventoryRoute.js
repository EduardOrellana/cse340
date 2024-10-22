// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utility = require("../utilities/index")
const carValidation = require("../utilities/car-validation")

/* **********************
 * Route Definitions
 ************************/

// Management View Route (Main Inventory Management Page)
router.get("/", 
    utility.checkJWTToken, 
    utility.checkLogin,
    utility.handleErrors(invController.manage))

// Route to display vehicles by classification ID
// ":classificationId" es un parámetro de ruta que captura el ID de clasificación desde la URL.
router.get("/type/:classificationId", utility.handleErrors(invController.buildByClassificationId))

// Route to display vehicle details by car ID
router.get("/detail/:car_Id", utility.handleErrors(invController.informationCarId))

// Route to display the form to add a new classification
router.get("/addingClassification", utility.checkJWTToken, utility.checkLogin, utility.handleErrors(invController.buildAddClassification))

//Route to display the form to add a new Car
router.get("/addingCar", utility.checkJWTToken, utility.checkLogin, utility.handleErrors(invController.buildAddCar))


// Route to add a new Classification Car
router.post("/addingClassification",
    carValidation.classificationRules(),
    carValidation.checkClassfication,
    utility.handleErrors(invController.addNewClassification)
)

//Route to add a new Car
router.post("/addingCar",
    carValidation.carsRules(),
    carValidation.checkCars,
    utility.handleErrors(invController.addNewCar)
)

router.get("/edit_delete", 
    utility.checkJWTToken,
    utility.checkLogin,
    utility.handleErrors(invController.buildGeneralInventory)
)

//Confirm Delete or edit Item
router.get("/edit/:item_id", 
    utility.checkJWTToken, 
    utility.checkLogin, 
    utility.handleErrors(invController.buildEditInv))

router.get("/delete/:item_id", 
    utility.checkJWTToken, 
    utility.checkLogin, 
    utility.handleErrors(invController.buildDeleteInv))

router.post("/edit", 
    utility.handleErrors(invController.confirmEditItem))

router.post("/delete", 
    utility.handleErrors(invController.confirmDeleteItem))

module.exports = router