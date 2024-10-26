const invModel = require("../models/inventory-model")
const cartModel = require("../models/cart-model")
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
        //let getMyAccountLink = await utilities.getMyAccountLink(req, res);

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
            //getMyAccountLink,
            grid,
        });
    } catch (error) {
        next(error);
    }
};

invCont.buildGeneralInventory = async (req, res, next) => {
    try {

        let nav = await utilities.getNav()
        //let getMyAccountLink = await utilities.getMyAccountLink(req, res)

        let classificationsData = await invModel.getClassifications();

        let sectionList = '<ul id="general-inventory">';

        for (let i of classificationsData.rows) {

            sectionList += `<li class="items">${i.classification_name}`

            let data = await invModel.getInventoryByClassificationId(i.classification_id);

            let carsList = await utilities.buildListCars(data)

            sectionList += carsList

            sectionList += `</li>`

        }

        sectionList += '</ul>'

        console.log(sectionList)

        if (!sectionList || sectionList.length) {
            res.status(201).render("./inventory/edit_deleteSection", {
                title: "Edit or Delete Items",
                nav,
                //getMyAccountLink,
                list: sectionList
            })
        }


    } catch (error) {
        next(error)
    }
};

invCont.informationCarId = async function (req, res, next) {
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

        //let getMyAccountLink = await utilities.getMyAccountLink(req, res);

        const car_name = 'Vehicle: ' + data[0].inv_make;
        //debugin
        console.log(`Car_name: ${car_name}`)

        res.render("./inventory/inv-info", {
            title: car_name,
            nav,
            //getMyAccountLink,
            info_car,
        })
    } catch (error) {
        console.error("Error with the Id" + carId, error)
        next({
            status: 500,
            message: "Something happend accross the server."
        })
    }

}


invCont.manage = async function (req, res, next) {
    try {
        let nav = await utilities.getNav();

        if (res.locals.accountData.account_type == "Admin"){
            res.render("./inventory/manage", {
                title: "Management",
                nav,
                //getMyAccountLink,
                errors: null
            })
        }else {
            res.redirect("/")
            }
        }
        //let getMyAccountLink = await utilities.getMyAccountLink(req, res);

    catch (error) {
        next(error)
    }}

invCont.buildAddClassification = async function (req, res, next) {
    try {
        let nav = await utilities.getNav();
        //let getMyAccountLink = await utilities.getMyAccountLink(req, res)
        res.render("inventory/addClassification", {
            title: "Adding a New Classication",
            nav,
            //getMyAccountLink,
            errors: null
        })
    } catch (error) {
        next(error)
    }
}

invCont.buildAddCar = async (req, res, next) => {
    try {
        let nav = await utilities.getNav();
        //let getMyAccountLink = await utilities.getMyAccountLink(req, res)
        let options = await utilities.getClassificationNames();
        res.render("inventory/addCar", {
            title: "Adding A New Car",
            nav,
            //getMyAccountLink,
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
        //let getMyAccountLink = await utilities.getMyAccountLink(req, res)

        const { classification_name } = req.body;

        const Result = await invModel.registerClassification(classification_name)

        if (Result) {
            req.flash(
                "notice",
                `The classification ${classification_name}, was register succesfully.`
            )

            res.status(201).redirect("/")
            
        } else {

            req.flash("notice", "Sorry the process failed")
            res.status(501).render("inventory/addClassification", {
                title: "Adding Classification",
                nav,
                //getMyAccountLink,
                errors: null
            }

            )

        }

    } catch (error) {
        next(error)
    }
}

invCont.addNewCar = async (req, res, next) => {
    try {
        let nav = await utilities.getNav();
        //let getMyAccountLink = await utilities.getMyAccountLink(req, res)
        const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
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
                //getMyAccountLink
                errors: null
            }
            )
        } else {
            req.flash("notice", "Sorry something happend.")
            res.status(501).render("inventory/addCar", {
                title: "Adding a New Car",
                nav,
            })
        }
    } catch (error) {
        next(error)
    }
}


invCont.buildEditInv = async (req, res, next) => {
    try {

        let inv_id = req.params.item_id

        let nav = await utilities.getNav()
        //let getMyAccountLink = await utilities.getMyAccountLink(req, res)

        //let options = await utilities.getClassificationNames()

        let data = await invModel.getCarrById(inv_id)

        let inv_make = data[0].inv_make
        let inv_model = data[0].inv_model
        let inv_year = data[0].inv_year
        let inv_price = data[0].inv_price
        let inv_miles = data[0].inv_miles
        let inv_color = data[0].inv_color
        let inv_description = data[0].inv_description
        let inv_image = data[0].inv_image_source


        res.status(200).render("inventory/editconfirmation", {
            title: "Edit Item",
            nav,
            //getMyAccountLink,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
            inv_miles,
            inv_color,
            inv_description,
            inv_image,
            inv_id
        })

    } catch (error) {
        next(error)
    }
}

invCont.buildDeleteInv = async (req, res, next) => {
    try {

        let inv_id = req.params.item_id

        let nav = await utilities.getNav()

        let data = await invModel.getCarrById(inv_id)

        let inv_make = data[0].inv_make
        let inv_model = data[0].inv_model
        let inv_year = data[0].inv_year
        let inv_image = data[0].inv_image_source


        res.status(200).render("inventory/deleteconfirmation", {
            title: "Delete Item",
            nav,
            //getMyAccountLink,
            inv_make,
            inv_model,
            inv_year,
            inv_id,
            inv_image
        })

    } catch (error) {
        next(error)
    }
}

invCont.confirmEditItem = async (req, res, next) => {
    try {
        //let nav = await utilities.getNav()
        //let getMyAccountLink = await utilities.getMyAccountLink(req, res)
        let {inv_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color} = req.body

        const queryUpdate = await invModel.updateItem(inv_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color)

        console.log(queryUpdate)

        if (queryUpdate) {
            req.flash("notice", "The process ran successfully");
            res.status(201).redirect("/inv/")
        } else {
            req.flash("notice", "Sorry, the deleted failed.");
            res.status(501).redirect("/inv/");
        }

    } catch (error) {
        next(error)
    }
}

invCont.confirmDeleteItem = async (req, res, next) => {
    try {

        console.log("DELETE ITEM!!!!!!!!!!!!")

        let nav = await utilities.getNav()

        let {inv_id} = req.body

        const queryDelete = await invModel.deleteItem(inv_id)

        console.log(queryDelete)

        if (queryDelete) {
            //req.flash("notice", "The process ran successfully");
            res.status(201).redirect("/inv/")

        } else {
            req.flash("notice", "Sorry, the deleted failed.");
            res.status(501).redirect("/inv/");
        }

    } catch (error) {
        next(error)
    }

}

invCont.addToCart = async (req, res, next) => {
    try {

        let nav = await utilities.getNav()
        let car_id = req.params.car_id
        
        let query = await cartModel.addToCart(car_id, res.locals.accountData.account_id)

        if (query) {
            let car_inventory = await cartModel.getCart();

            req.flash("notice", "One item was added into your Cart.");
            res.status(201).redirect(`/inv/detail/${car_id}`)
        }
        else {
            req.flash("notice", "Sorry, the adding failed");
            res.status(501).redirect("/");
        }

    } catch(error) {
        next(error)
    }
}

module.exports = invCont