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
    try {
        const carId = req.params.car_Id
        const data = await invModel.getCarrById(carId)

        if (!data || data === 0) {
            return next({
                status: 404,
                message: `Car with the Id ${carId} doesn't exists.`
            })   
        }

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
    }catch(error) {
        console.error("Error with the Id" + carId, error)
        next({
            status: 500,
            message: "Something happend accross the server."
        })
    }

}


invCont.manage = async function(req, res, next) {
    try {
        let nav = await utilities.getNav();
        res.render("./inventory/manage", {
            title: "Management",
            nav
        })
    } catch (error) {
        next(error)
    }
}

invCont.buildAddClassification = async function(req, res, next) {
    try {
        let nav = await utilities.getNav();
        res.render("./inventory/addClassification", {
            title: "Adding a New Classication",
            nav,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

invCont.form_management = async (req, res, next) => {
    try {
        let nav = await utilities.getNav();
        
        const {classification_name} = req.body;

        const regResult = await invModel.registerClassification(
            classification_name
        )

        if (regResult) {
            req.flash(
                "notice",
                `The classification ${classification_name}, was register succesfully.`
            )

            res.status(201).render(
                "./inventory/manage", {
                title: "Management",
                nav
                }
            )
        } else {

            req.flash("notice", "Sorry the process failed")
            req.status(501).render("./inventory/addClassification",

            )

        }

        // res.render("./inventory/addClassification", this.buildAddClassification)

    } catch(error) {
        next(error)
    }
}

module.exports = invCont