const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const utilManage = require("../utilities/managementUtil")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_id = req.params.classificationId;
        const data = await invModel.getInventoryByClassificationId(classification_id);

        // Obtener nav y el enlace de cuenta antes de verificar los datos
        let nav = await utilities.getNav();
        let getMyAccountLink = await utilities.getMyAccountLink(req, res);

        // Verificar si no hay datos
        if (!data || data.length === 0) {
            return res.status(404).render("inventory/nocars", {
                title: "No Cars Available",
                message: `No cars found for classification id ${classification_id}`,
                nav,
                getMyAccountLink,
            });
        }

        const grid = await utilities.buildClassificationGrid(data);
        const className = data[0].classification_name;

        res.render("./inventory/classification", {
            title: className + " vehicles",
            nav,
            getMyAccountLink,
            grid,
        });
    } catch (error) {
        next(error);
    }
};

invCont.buildGeneralInventory = async (req, res, next) => {
    try {

        let nav = await utilities.getNav()
        let getMyAccountLink = await utilities.getMyAccountLink(req, res)

        let classificationsData = await invModel.getClassifications();

        let sectionList = '<ul id="general-inventory">';

        for (let i of classificationsData.rows){

            sectionList += `<li class="items">${i.classification_name}</li>`

            let data = await invModel.getInventoryByClassificationId(i.classification_id);

            let carsList = await utilities.buildListCars(data)
            
            sectionList += carsList

        }

        sectionList += '</ul>'

        console.log(sectionList)

        if (!sectionList || sectionList.length) {
            res.status(201).render("./inventory/edit_deleteSection", {
                title: "Edit or Delete Items",
                nav,
                getMyAccountLink,
                list: sectionList
            })
        }


    } catch (error) {
        next(error)
    }
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

        let getMyAccountLink = await utilities.getMyAccountLink(req, res);
        
        const car_name = 'Vehicle: ' + data[0].inv_make;
        //debugin
        console.log(`Car_name: ${car_name}`)
        
        res.render("./inventory/inv-info", {
            title: car_name ,
            nav,
            getMyAccountLink,
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
        let getMyAccountLink = await utilities.getMyAccountLink(req, res);
        res.render("./inventory/manage", {
            title: "Management",
            nav,
            getMyAccountLink,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

invCont.buildAddClassification = async function(req, res, next) {
    try {
        let nav = await utilities.getNav();
        let getMyAccountLink = await utilities.getMyAccountLink(req, res)
        res.render("inventory/addClassification", {
            title: "Adding a New Classication",
            nav,
            getMyAccountLink,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

invCont.buildAddCar = async (req, res, next) => {
    try {
        let nav = await utilities.getNav();
        let getMyAccountLink = await utilities.getMyAccountLink(req, res)
        let options = await utilities.getClassificationNames();
        res.render("inventory/addCar", {
            title: "Adding A New Car",
            nav,
            getMyAccountLink,
            options,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

invCont.addNewClassification = async (req, res, next) => {
    try {
        let nav = await utilities.getNav();
        let getMyAccountLink = await utilities.getMyAccountLink(req, res)
        
        const {classification_name} = req.body;

        const Result = await invModel.registerClassification(classification_name)

        if (Result) {
            req.flash(
                "notice",
                `The classification ${classification_name}, was register succesfully.`
            )

            res.status(201).render(
                "inventory/manage", {
                title: "Manage System",
                nav,
                getMyAccountLink
                }
            )
        } else {

            req.flash("notice", "Sorry the process failed")
            res.status(501).render("inventory/addClassification", {
                title: "Adding Classification",
                nav,
                getMyAccountLink,
            }

            )

        }

    } catch(error) {
        next(error)
    }
}

invCont.addNewCar = async (req, res, next) => {
    try {
        let nav = await utilities.getNav();
        let getMyAccountLink = await utilities.getMyAccountLink(req, res)
        const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body
        const Result = await invModel.addNewCar(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

        console.log(`Data: ${req.body}`)
        
        if (Result) {
            req.flash(
                "notice",
                `The car ${inv_model}, was added succesfully.`
            )

            res.status(201).render(
                "inventory/manage", {
                    title: "Management",
                    nav,
                    getMyAccountLink
                }
            )
        } else {
            req.flash("notice", "Sorry something happend.")
            res.status(501).render("inventory/addCar", {
                title: "Adding a New Car",
                nav,
            })
        }
    } catch(error) {
        next(error)
    }
}


invCont.deleteInv = async (req, res, next) => {
    try {
        let nav = await utilities.getNav()
        let getMyAccountLink = await utilities.getMyAccountLink(req, res)


    } catch(error) {
        next(error)
    }
}

module.exports = invCont