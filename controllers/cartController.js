const cartModel = require("../models/cart-model")
const util = require("../utilities/index")

const cartController = {}

/**Buil
 * the principal page of the cart.
 */
cartController.buildCart = async (req, res, next) =>{
    try {
        const cart = await util.getCart(req, res, next);
        //console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT')
        //console.log(cart)
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

cartController.cleanCart = async (req, res, next) => {
    try {

        let query = await cartModel.clearCart(res.locals.accountData.account_id);

        if (query) {
            req.flash("notice", "the inventory was truncated")
            res.status(201).redirect("cart")
        } else {
            req.flash("notice", "The Cart was reseted.")
            res.status(501).redirect("cart")
        }
    }catch(error) {
        next(error)
    }
}

cartController.buildDeleteItem = async (req, res, next) => {
    try {
        let nav = await util.getNav()
        let invId = req.params.inv_id
        let data = await cartModel.getItemCart(invId, res.locals.accountData.account_id)



        res.status(201).render("cart/drop_item_cart", {
            title: "Delete Item From Cart",
            nav,
            inv_id : data.inv_id,
            inv_image : data.inv_image,
            inv_make : data.inv_make,
            inv_model : data.inv_model
        })

    }catch(error) {
        next(error)
    }
}

cartController.confirmDeleteItem = async (req, res, next) => {
    try {
        let {inv_id} = req.body
        let query = await cartModel.deleteItemFromCart(inv_id, res.locals.accountData.account_id)

        if (query) {
            req.flash("notice", "One Item was deleted");
            res.status(201).redirect("/cart")
        }else {
            req.flash("notice", "Sorry, please try again")
            res.status(501).redirect(`/cart/deleteItem/${inv_id}`)
        }
    } catch(error) {
        next(error)
    }
}

module.exports = cartController