const express = require("express")
const router = new express.Router()
const utility = require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

router.get("/login", 
    //utility.checkLogin, 
    utility.handleErrors(accountController.buildLogin))    

//route to register
router.get("/register", utility.handleErrors(accountController.buildRegister))

router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,   
    utility.handleErrors(accountController.registerAccount))

router.post("/login",
    regValidate.loginRules(),
    //regValidate.checkLoginData,
    utility.handleErrors(accountController.accountLogin)
)

router.get("/logged",
    utility.checkJWTToken,
    utility.checkLogin,
    utility.handleErrors(accountController.buildManagement)
)

router.get("/account/:account_id",
    utility.checkJWTToken,
    utility.checkLogin,
    utility.handleErrors(accountController.buildEditProfile)
)

module.exports = router;