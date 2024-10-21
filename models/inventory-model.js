  const pool = require("../database/") //when we have just one index level doesn't care if we write it or not.
//exporting from the database folder the query when we are going to retrieve the data.
/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_id")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getCarrById(carId) {
  try {
    const data = await pool.query(
      `SELECT
        T1.inv_make,
        T1.inv_model,
        T1.inv_year,
        T1.inv_description,
        T1.inv_image AS inv_image_source,
        T1.inv_thumbnail AS inv_image_mobile,
        T1.inv_price,
        T1.inv_miles,
        T1.inv_color,
        T1.classification_id,
        T2.classification_name
      FROM public.inventory T1
      JOIN public.classification T2
        ON T1.classification_id = T2.classification_id
      WHERE T1.inv_id = $1`, [carId]
    );

    console.log("information: " + data.rows)
    return data.rows
  } catch (error) {
    console.error("getCarrById error " + error)
  }
}

async function registerClassification(classification_name) {
  try {
    const sql = `INSERT INTO public.classification (classification_name)
                  VALUES ($1) RETURNING *`
    return await pool.query(sql, [classification_name])
  } catch(error){
    return error.message
  }
}

async function checkClass(classification_name) {
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

async function addNewCar(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = `INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`

    //console.log(pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]))

    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch(error) {
    console.error("error with the inserting data."), error;
    throw new Error("Failed inserting new Car")
  }
}


async function updateItem(inv_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color) {
  try {

    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_price = $5, inv_miles = $6, inv_color = $7 WHERE inv_id = $8 RETURNING *"

    const result = await pool(sql, [inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_id])

    return result.rows[0]

  } catch(error) {
    console.error("error with the updating car"), error;
    throw new Error("Failed updating the item")
  }
}

async function deleteItem(inv_id) {
  try {

    const sql = "DELETE FROM public.inventory WHERE inv_id = $1"

    const result = await pool(sql, [inv_id])

    return result.rows[0]

  } catch(error) {
    throw new Error("Falied the deleting of the item")
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getCarrById, registerClassification, checkClass, addNewCar, updateItem, deleteItem} //exporting the async function getClassifications.