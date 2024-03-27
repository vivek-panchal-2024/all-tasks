const mysql = require("mysql");
require("dotenv").config();

var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    multipleStatements: true
})

const runParaQuery = (sql, values)=>{
    return new Promise( (resolve, reject)=>{
        connection.query(sql, [values], (error, result)=>{
            try {
                resolve(result);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    } )
}

const runParameterQuery = (sql, values)=>{
    return new Promise( (resolve, reject)=>{
        connection.query(sql, values, (error, result)=>{
            try {
                resolve(result);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    } )
}



const runQuery = (sql)=>{
    return new Promise( (resolve, reject)=>{
        connection.query(sql, (error, result)=>{
            try {
                resolve(result);    
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    } )
}
module.exports = {runParaQuery, runQuery, runParameterQuery};