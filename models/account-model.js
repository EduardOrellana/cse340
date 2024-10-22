
const { check } = require("express-validator")
const pool = require("../database/index")
const registerAccount = {}

/* *****************************
*   Register new account
* *************************** */
registerAccount.register = async (account_firstname, account_lastname, account_email, account_password) => {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
registerAccount.checkExistingEmail = async (account_email) => {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
registerAccount.getAccountByEmail = async (account_email) => {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

registerAccount.getPasswordByUser = async (account_id) => {
    try {
        const result = await pool.query(
            'SELECT account_password FROM public.account WHERE account_id = $1',
            [account_id]
        )
        return result.rows[0]
    } catch (error) {
        return new Error("Error, please try again.")
    }
}

registerAccount.updatePersonalInformation = async ( account_id, account_firstname, account_lastname, account_email) => {
    try {
        const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"

        const _result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])

        console.log(`RESULT: ${JSON.stringify(_result)}`)

        return _result.rows[0]

    } catch (error) {
        throw error;
    }
}

registerAccount.updatePassword = async (account_id, newPassword) => {
    try {
        let sql = "UPDATE account SET account_password = $2 WHERE account_id = $1 RETURNING account_password"

        const _result = await pool.query(sql, [account_id, newPassword])

        return _result.rows[0]

    } catch(error) {
        throw error;
    }
}


module.exports = registerAccount
