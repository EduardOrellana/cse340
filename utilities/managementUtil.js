const util = require("./index")

let adminUtil = {}

adminUtil.editProfile = (id) => {

    let id_profile = id

    let link = `<a href="/account/updateInfo">Edit Personal Information</a>`

    return link
}

adminUtil.buildTools = async (req, res, next) => {

}


module.exports = adminUtil