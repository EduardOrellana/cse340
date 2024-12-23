const invModel = require("../models/inventory-model");
const cartModel = require("../models/cart-model");
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

//Util to get the select option regarding the classifications
Util.getClassificationNames = async (req, res, next) => {
    let data = await invModel.getClassifications();
    let _select;
    data.rows.forEach((row) => {
        _select +=
            `<option value="${row.classification_id}">${row.classification_name}</option>`
    })
    return _select
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid = '';
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

//Build a list of cars

Util.buildListCars = async function(data) {

    let _list = '<ul class="listCars">'

    if (data.length > 0){
        data.forEach(item => {
            _list += `<li><span>${item.inv_model} |</span> <a href="/inv/edit/${item.inv_id}">Edit</a> <span>|</span> <a href="/inv/delete/${item.inv_id}">Delete</a></li>`
        })
    } else {
        _list += "<ul><li>No items available</li></ul>"
    }

    _list += '</ul>'
    return _list
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
Util.buildCarInformation = async function (data) {
    element = data[0];
    _price = new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD"
    }).format(element.inv_price);

    _miles = new Intl.NumberFormat('en-ES', {
        style: "decimal"
    }).format(element.inv_miles);

    let structure = '';
    //let image;

    if (!data || data.length === 0) {
        return '<p>No image available</p>';
    }
    structure = '<div id="car-information">'
    //image section
    structure +=
        '<figure id="car-image">'
        + '<picture>'
        //+ '<source id="car-image-mobile" srcset="' + element.inv_image_mobile + '" media="(max-width: 819px)">' 
        + '<img src="' + element.inv_image_source + '" alt="' + element.inv_make + '"' + ' loading="lazy">'
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
        + '<p>' + element.inv_description + '</p>'
        + '</section>'
        + '</div>'

    return structure
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next))
        .catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        res.locals.loggedin = 0
        next()
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}


Util.getMyAccountLink = async (req, res, next) => {

    if(req.cookies.jwt) {

        let _status = "Welcome Basic"

        if(res.locals.accountData.account_type == "Admin") {
            _status = "Welcome Happy"
        }

        return `<a id="myAcountLink" href="/account/logged">${_status}</a> 
                <form action="/" method='POST'>
                    <button type="submit"> 
                        Log Out
                    </button>
                </form>`
    } else {
        return `<a id="myAcountLink-logout" href="/account/login">My Account</a>`
    }
}


/*Enhacement adding the cart Util*/

Util.getCart = async (req, res, next) => {
    let data = await cartModel.getCart(res.locals.accountData.account_id)
    let _html = "<div id='cart-container'>";
    let _price = 0;

    if (data.rowCount > 0) {
        _html += `
            <table>
                <caption> Cart Inventory </caption>
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Car</th>
                        <th scope="col">Year</th>
                        <th scope="col">Price</th>
                        <th scope="col">Details</th>
                        <th scope="col">Delete Button</th>
                    </tr>
                </thead>
                <tbody>`
        data.rows.forEach((row) => {
            _html += 
                `<tr>
                    <th scope="row">${row.inv_id}</th>
                    <td>${row.inv_make} ${row.inv_model}</td>
                    <td>${row.inv_year}</td>
                    <td>${new Intl.NumberFormat('en-US', {style: "currency", currency : "USD"}).format(row.inv_price)}</td>
                    <td><a href="/inv/detail/${row.inv_id}">Click to go details section</a></td>
                    <td><a href="/cart/deleteItem/${row.inv_id}">Delete Item</a></td>
                </tr>
                `
            _price += parseFloat(row.inv_price)
        })

        let _displayPrice = new Intl.NumberFormat('en-US', {
            style: "currency",
            currency: "USD"
        }).format(_price);

        _html += '</tbody>'
        _html += `
            <tfoot>
                <tr>
                    <th scope="row" colspan="2"> Total Items</th>
                    <td>${data.rowCount}</td>
                    <th scope="row" colspan="2">Total Price</th>
                    <td>${_displayPrice}</td>
                </tr>
            </tfoot>
        `
        _html += `</table>
                </div>`
        return _html
    } else {
        _html = '<h2>You have not added a car.</h2>'
        return _html
    }

}

module.exports = Util