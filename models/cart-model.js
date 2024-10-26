const pool = require("../database/index")


async function getCart(account_id) {
    try{
        const _table = await pool.query("SELECT * FROM public.cart WHERE account_id = $1", [account_id])
        return _table
    } catch(error) {
        console.error("error with getting the cart."), error;
        throw new Error("Something ran wrong.")
    }

}

async function getItemCart(inv_id, account_id) {
    try{
        const data = await pool.query('SELECT * FROM public.cart WHERE inv_id = $1 AND account_id = $2', [inv_id, account_id])
        return data.rows[0]
    }catch(error) {
        console.error("error with getting the item."), error;
        throw new Error("Someting is running wrong, pleasy try again.")
    }
}

async function clearCart(account_id) {
    try{
        const _query = await pool.query("DELETE FROM public.cart WHERE account_id = $1 RETURNING *", [account_id])
        return _query.rows[0]
    } catch(error) {
        console.error("error with getting the cart."), error;
        throw new Error("Something ran wrong.")
    }
}

async function addToCart(inv_id, account_id) {
    try{
        const _query = await pool.query("INSERT INTO public.cart SELECT *, $2 FROM public.inventory WHERE inv_id = $1 RETURNING *", [inv_id, account_id])
        return _query.rows[0]
    } catch(error) {
        console.error("error with getting the cart."), error;
        throw new Error("Something ran wrong.")
    }
}

async function deleteItemFromCart(inv_id, account_id) {
    try{
        const _query = await pool.query("DELETE FROM public.cart WHERE inv_id = $1 AND account_id = $2 RETURNING *", [inv_id, account_id])
        return _query.rows[0]
    } catch(error) {
        console.error("error with getting the cart."), error;
        throw new Error("Something ran wrong.")
    }
}

module.exports = {getCart, clearCart, addToCart, deleteItemFromCart, getItemCart}