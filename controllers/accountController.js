const utility = require("../utilities/index");
const utilityManagement = require("../utilities/managementUtil")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { link } = require("../routes/static");
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
    try {
        let nav = await utility.getNav();
        let getMyAccountLink = await utility.getMyAccountLink(req, res);
        //req.flash("notice", "this is an example")
        res.render("account/login", {
            title: "Login",
            nav,
            getMyAccountLink,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

async function buildRegister(req, res, next) {
    try {
        let nav = await utility.getNav();
        let getMyAccountLink = await utility.getMyAccountLink(req, res);
        //req.flash("notice", "placeholder")
        res.render("account/register", {
            title: "Register",
            nav,
            getMyAccountLink,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

async function registerAccount(req, res, next) {
    try {
        let nav = await utility.getNav();
        let getMyAccountLink = await utility.getMyAccountLink(req, res);
        const { account_firstname, account_lastname, account_email, account_password } = req.body

        // Hash the password before storing
        let hashedPassword
        try {
            // regular password and cost (salt is generated automatically)
            hashedPassword = await bcrypt.hash(account_password, 10)
        } catch (error) {
            req.flash("notice", 'Sorry, there was an error processing the registration.')
            res.status(500).render("account/register", {
                title: "Registration",
                nav,
                getMyAccountLink,
                errors: null,
            })
        }

        const regResult = await accountModel.register(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword
        )

        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you're registered ${account_firstname}. Please log in.`
            )
            res.status(201).render("account/login", {
                title: "Login",
                nav,

            })
        } else {
            req.flash("notice", "Sorry, the registration failed.")
            res.status(501).render("account/register", {
                title: "Registration",
                nav,
            })
        }
    } catch (error) {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,})
    }
}


/* ****************************************
 *  Process login request
 * ************************************ */

    async function accountLogin(req, res) {
        let nav = await utility.getNav();
        let getMyAccountLink = await utility.getMyAccountLink(req, res);
        const { account_email, account_password } = req.body
        const accountData = await accountModel.getAccountByEmail(account_email)
        if (!accountData) {
            req.flash("notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                getMyAccountLink,
                errors: null,
                account_email,
            })
            return
        }
        try {
            if (await bcrypt.compare(account_password, accountData.account_password)) {
                delete accountData.account_password
                const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
                if (process.env.NODE_ENV === 'development') {
                    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
                } else {
                    res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
                }
                return res.redirect("logged")
            }
        } catch (error) {
            return new Error('Access Forbidden')
        }
    }

async function buildManagement(req, res, next) {
    //verify de information of the cookie

    let info = await accountModel.getAccountByEmail(res.locals.accountData.account_email)
    let status = info.account_type
    let user = info.account_firstname + " " + info.account_lastname
    let user_id = info.account_id
    

    //let linkProfile = utilityManagement.editProfile(user_id)
    let nav = await utility.getNav()
    let getMyAccountLink = await utility.getMyAccountLink(req, res);

    res.render("account/logged", {
        title: "Management User",
        nav,
        getMyAccountLink,
        user,
        status
        //linkToEdit: linkProfile
    })
}

async function buildEditProfile(req, res, next) {

    let nav = await utility.getNav();
    let getMyAccountLink = await utility.getMyAccountLink(req, res);
    let info = await accountModel.getAccountByEmail(res.locals.accountData.account_email)

    let user_name = info.account_firstname
    let user_lname = info.account_lastname
    let user_email = info.account_email
    //let user_pass = info.account_password

    //let user_password = res.locals.accountData.acccount_password

    res.render("account/profile", {
        title: "Updating your information",
        nav,
        getMyAccountLink,
        user_name,
        user_lname,
        user_email,
        errors: null
    })
}

async function editProfile(req, res, next) {

    let account_id = res.locals.accountData.account_id; // Corregido el nombre de la variable

    let { account_firstname, account_lastname, account_email, account_password } = req.body;


    try {
        // Asegúrate de esperar el resultado de la consulta
        const _query = await accountModel.updatePersonalInformation(
            account_id,
            account_firstname,
            account_lastname,
            account_email
        );

        //console.log(_query)

        if (_query) {
            req.flash("notice", "The process ran successfully");
            res.status(200).redirect("logged");  
        } else {
            req.flash("notice", "Sorry, the updating failed.");
            res.status(501).redirect("logged");
        }
    } catch (error) {
        // Manejo de errores en caso de que ocurra algún problema con la consulta
        req.flash("notice", "An error occurred during the update process.");
        res.status(500).redirect("logged");
    }
}

async function buildEditPassword(req, res, next) {

    let nav = await utility.getNav();
    let getMyAccountLink = await utility.getMyAccountLink(req, res);
    let info = await accountModel.getAccountByEmail(res.locals.accountData.account_email)

    res.render("account/newPassword", {
        title: "Updating your information",
        nav,
        getMyAccountLink,
        errors: null
    })
}

async function updatePassword(req, res, next) {
    try {

        let {account_password} = req.body
        let accountId = res.locals.accountData.account_id
        let hashedpassword = await bcrypt.hash(account_password, 10)

        const runQuery = await accountModel.updatePassword(
            accountId,
            hashedpassword
        )

        if (runQuery) {
            req.flash(
                "notice",
                "Your password was updated."
            )
            res.status(201).redirect("logged")
        } else {
            req.flash(
                "notice",
                "Something ran wrong, please try again."
            )
            res.status(501).redirect("logged")
        }

    } catch(error){
        throw error
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, buildEditProfile, editProfile, buildEditPassword, updatePassword};
