const utilities = require(".")
const {body, validationResult} = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")


validate.registrationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide the Classification Name")
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkClassfication(classification_name)
                if (classificationExists) {
                    throw new Error("Classification already exists. Please try with another classification")
                }
            })
    ]
}

validate.checkClassfication = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    erros = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inv/addingClassification", {
            errors,
            title: "Adding Classification",
            nav,
            classification_name
        })
    }
    next()  
}