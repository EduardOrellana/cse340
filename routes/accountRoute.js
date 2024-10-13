const express = require("express")
const router = new express.Router()
const utility = require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

router.get("/login", utility.handleErrors(accountController.buildLogin))

//route to register
router.get("/register", utility.handleErrors(accountController.buildRegister))

router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,    
    utility.handleErrors(accountController.registerAccount))

router.post("/login",
    (req, res) => {
        res.status(200).send('login process')
    }
)


module.exports = router;