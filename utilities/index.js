const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
//getNav is not from Expres is a custom Method.
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

//building the utility function to set the information for each car.

/*
Structure this utility will build:
Title of the Vehicle
Image of the Vehicle from the Query from the Model.

    T1.inv_make,
    T1.inv_model,
    T1.inv_year,
    T1.inv_description,
    T1.inv_image AS inv_image_source,
    T1.inv_thumbnail AS inv_image_mobile,
    T1.inv_price, using this new Intl.NumberFormat('en-US').format(vehicle.inv_price)
    T1.inv_miles, with commas
    T1.inv_color,
    T2.classification_name



*/
Util.buildCarInformation = async function(data){
    element = data[0];
    _price = new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD"
    }).format(element.inv_price);

    _miles = new Intl.NumberFormat('en-ES', {
        style: "decimal"
    }).format(element.inv_miles);

    let structure;
    let image

    if (!data || data.length === 0) {
        return '<p>No image available</p>';
    }
    structure = '<div id="car-information">'
    //image section
    structure += 
                '<figure id="car-image">'
                        + '<picture>'
                            //+ '<source id="car-image-mobile" srcset="' + element.inv_image_mobile + '" media="(max-width: 819px)">' 
                            + '<img src="' + element.inv_image_source + '" alt="' + element.inv_make +'"' + ' loading="lazy">'
                        + '</picture>'
                    + '<figcaption> ' + element.inv_year + ' - ' + element.inv_make + ' - ' + _price + '</figcaption>'
                + '</figure>'
    //info section
    structure +=
                '<section id="info">'
                    //+ '<h2>' + element.inv_year + ' - ' + element.inv_make + ' - ' + _price + '</h2>'
                    + '<h3>General Information: </h3>'
                    + '<ul id="general-information-vehicle">'
                        + '<li> Make: ' + element.inv_make + '</li>'
                        + '<li> Model: ' + element.inv_model + '</li>'
                        + '<li> Clasification: ' + element.classification_name + '</li>'
                        + '<li> Year: ' + element.inv_year + '</li>'
                        + '<li> Price: ' + _price + '</li>'
                        + '<li> Miles: ' + _miles + '</li>'
                        + '<li> Color: ' + element.inv_color + '</li>'
                    + '</ul>'
                    + '<br>'
                    + '<h4>Description: </h4>'
                    + '<p>' +element.inv_description+ '</p>'
                + '</section>'
                + '</div>'
    
    return structure
}

module.exports = Util