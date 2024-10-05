const { Pool } = require("pg"); //Pool collecction from the pg package.
require("dotenv").config(); //import dotenv
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool;
if (process.env.NODE_ENV == "development") {
    pool = new Pool({ //new Pool instance
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    // Added for troubleshooting queries
    // during development
    module.exports = {//Exporting this function.
        async query(text, params) {
            try {
                const res = await pool.query(text, params);
                console.log("executed query", { text });
                return res;
            } catch (error) {
                console.error("error in query", { text });
                throw error;
            }
        },
    };
} else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });
    module.exports = pool;
}
