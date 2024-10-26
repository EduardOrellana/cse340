const pool = require("../database/index")


async function getCart() {
    try{
        const _table = await pool.query("SELECT * FROM public.cart")
        return _table
    } catch(error) {
        console.error("error with getting the cart."), error;
        throw new Error("Something ran wrong.")
    }

}

async function getItemCart(inv_id) {
    try{
        const data = await pool.query('SELECT * FROM public.cart WHERE inv_id = $1', [inv_id])
        return data.rows[0]
    }catch(error) {
        console.erro("error with getting the item."), error;
        throw new Error("Someting is running wrong, pleasy try again.")
    }
}

async function clearCart() {
    try{
        const _query = await pool.query("TRUNCATE TABLE public.cart")
        return _query.rows[0]
    } catch(error) {
        console.error("error with getting the cart."), error;
        throw new Error("Something ran wrong.")
    }
}

async function addToCart(inv_id) {
    try{
        const _query = await pool.query("INSERT INTO public.cart SELECT * FROM public.inventory WHERE inv_id = $1 RETURNING *", [inv_id])
        return _query.rows[0]
    } catch(error) {
        console.error("error with getting the cart."), error;
        throw new Error("Something ran wrong.")
    }
}

async function deleteItemFromCart(inv_id) {
    try{
        const _query = await pool.query("DELETE FROM public.cart WHERE inv_id = $1 RETURNING *", [inv_id])
        return _query.rows[0]
    } catch(error) {
        console.error("error with getting the cart."), error;
        throw new Error("Something ran wrong.")
    }
}

module.exports = {getCart, clearCart, addToCart, deleteItemFromCart, getItemCart}