const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
};

invCont.informationCarId = async function (req, res, next){
    const carId = req.params.car_Id
    const data = await invModel.getCarrById(carId)
    const info_car = await utilities.buildCarInformation(data)
    let nav = await utilities.getNav();
    const car_name = 'Vehicle: ' + data[0].inv_make;
    //debugin
    console.log(`Car_name: ${car_name}`)
    
    res.render("./inventory/inv-info", {
        title: car_name ,
        nav,
        info_car,
    })
}


module.exports = invCont