const utilities = require(".")
const {body, validationResult} = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")


validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide the Classification Name")
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkClass(classification_name)
                if (classificationExists) {
                    throw new Error("Classification already exists. Please try with another classification")
                }
            })
    ]
}

validate.checkClassfication = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/addClassification", {
            errors,
            title: "Adding Classification",
            nav,
            classification_name
        })
        return
    }
    next()  
}

validate.carsRules = () => {
    return [
        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Please provide a Make for the vehicle"),
        
        body("inv_model")
            .trim()
            .notEmpty()
            .withMessage("Please provide a Model"),

        //year with only 4 digits and numbers
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isLength( { min: 4})
            .withMessage("Please provide one valid year."),

        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .toFloat()
            .withMessage("Please provide a valid price. (just numbers)"),

        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .toInt()
            .withMessage("Please provide a valid number in miles section."),

        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .toInt()
            .withMessage("Please select one category."),
    ]
}

validate.checkCars = async (req, res, next) => {
    const {inv_year, inv_price, inv_miles, classification_id} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/addCar", {
            errors,
            title: "Adding Classification",
            nav,
            inv_year: req.body.inv_year,
            inv_price: req.body.inv_price,
            inv_miles: req.body.inv_miles,
            classification_id: req.body.classification_id,
        })
        return
    }
    next()  
}

module.exports = validate