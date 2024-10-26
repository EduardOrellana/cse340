const express = require("express")
const router = new express.Router()
const utility = require("../utilities/index")
const cartController = require("../controllers/cartController")

router.get("/",
    utility.checkJWTToken,
    utility.checkLogin,
    utility.handleErrors(cartController.buildCart)
)

router.post("/",
    utility.handleErrors(cartController.cleanCart)
)

router.get("/deleteItem/:inv_id",
    utility.handleErrors(cartController.buildDeleteItem)
)

router.post("/deleteItem/:inv_id",
    utility.handleErrors(cartController.confirmDeleteItem)
)

module.exports = router