const cartModel = require("../models/cart-model")
const util = require("../utilities/index")

const cartController = {}

/**Buil
 * the principal page of the cart.
 */
cartController.buildCart = async (req, res, next) =>{
    try {
        const cart = await util.getCart();
        const nav = await util.getNav();

        res.status(201).render("./cart/my_cart", {
            title: "Cart Inventory",
            nav,
            cart
        })
    }catch(error){
        next(error);
    }
}

module.exports = cartController