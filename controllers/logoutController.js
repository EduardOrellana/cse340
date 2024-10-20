let LogOut = {}
const util = require("../utilities/index")

LogOut.deleteCookie = async (req, res, next) => {
    try {
        const cookieName = 'jwt'
        res.clearCookie(cookieName, { path: '/' }); 

        let nav = await util.getNav()
        let myAcountLink = await util.getMyAccountLink(req, res)


        res.status(200).render("index", {
            title: "Home",
            nav,
            getMyAccountLink: '<a id="myAcountLink-logout" href="/account/login">My Account</a>'
        })
    } catch (error) {
        next(error) 
    }
}


module.exports = LogOut