const util = require("./index")
const invModel = require("../models/inventory-model")

let adminUtil = {}

adminUtil.editProfile = (id) => {

    let id_profile = id

    let link = `<a href="/account/updateInfo">Edit Personal Information</a>`

    return link
}

adminUtil.getClassificationsList = async (req, res, next) => {
    let data = await invModel.getClassifications();
    let cars = [];

    let list = '<ul id="general-inventory">';

    data.rows.forEach((row) => {
        list += `<li class="items">${row.classification_name}</li>`

        cars =  invModel.getInventoryByClassificationId(row.classification_id)

        list += '<ul id="seg-inventory">'

        cars.rows.forEach((row) => {
            list += `<li class="item-car"><a href="/inv/edit_delete/${row.inv_id}">${row.inv_id + "-" + row.inv_make + " " + row.inv_model} </a></li>`
        })

        cars = []
    })

    list += '</ul>'

    return list
}



module.exports = adminUtil