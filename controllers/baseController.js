const utilities = require("../utilities/") //importing the function or action of the utilty.
const baseController = {} //declaring the array of the data.

baseController.buildHome = async function (req, res) {
    try {
        const nav = await utilities.getNav()
        //const getMyAccountLink = await utilities.getMyAccountLink(req, res) 
        //req.flash("notice", "This is a flash message.")
        res.render("index", { title: "Home", nav}) //rendering the index.html
    }catch(error) {
        next(error)
    }
}

module.exports = baseController