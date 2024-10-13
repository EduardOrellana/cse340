const pool = require("../database/") //when we have just one index level doesn't care if we write it or not.
//exporting from the database folder the query when we are going to retrieve the data.
/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
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
                  VALUE ($1) RETURNING *`
    return await pool.query(sql, [classification_name])
  } catch(error){
    return error.message
  }
}

async function checkClassification(classification_name) {
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getCarrById, registerClassification} //exporting the async function getClassifications.