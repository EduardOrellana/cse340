const utility = require("../utilities/index");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
    try {
        let nav = await utility.getNav();
        req.flash("notice", "this is an example")
        res.render("account/login", {
            title: "Login",
            nav,
        })
    }catch(error) {
        next(error)
    }
}

module.exports = { buildLogin };
