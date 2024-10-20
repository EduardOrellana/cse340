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
    let user = res.locals.accountData.account_firstname + " "  + res.locals.accountData.account_lastname
    let user_id = res.locals.accountData.account_id

    let linkProfile = utilityManagement.editProfile(user_id)
    let nav = await utility.getNav()
    let getMyAccountLink = await utility.getMyAccountLink(req, res);

    res.render("account/logged", {
        title: "Management User",
        nav,
        getMyAccountLink,
        user,
        linkToEdit: linkProfile
    })
}

async function buildEditProfile(req, res, next) {
    let nav = await utility.getNav();
    let getMyAccountLink = await utility.getMyAccountLink(req, res);

    let user_id = req.params.account_id

    let user_name = res.locals.accountData.account_firstname
    let user_lname = res.locals.accountData.account_lastname
    let user_email = res.locals.accountData.account_email
    let user_password = await accountModel.getPasswordByUser(user_id).account_password

    res.render("account/profile", {
        title: "Updating your information",
        nav,
        getMyAccountLink,
        user_name,
        user_lname,
        user_email,
        user_password,
        errors: null
    })

}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, buildEditProfile};
