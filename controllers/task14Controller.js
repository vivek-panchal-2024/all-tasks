const db = require("../db");

const renderCityStateView = (req, res) =>{
    try {
       if(db.connection){ 
            let sql = "select * from states;";
            db.connection.query(sql, (error, result)=>{
                if(error){
                    return res.render("./task14/City_State", {states: "", error: error, stateCount: 0});
                }
                res.render("./task14/City_State", {states: result, error: "", stateCount: 1});
            });
        } else{
            res.render("./task14/City_State", {states: "", error: "Somehting Went Wrong", stateCount: 0});
        }
    } catch (error) {
        console.error(error);
    }
}

const generateCities = (req, res)=>{
    try {
        if(db.connection){
            const values = [req.query.state];
            let sql = "select * from cities where state_id = ?;";
            db.connection.query(sql, values, (error, result)=>{
                if(error){
                    return res.render("./task14/City_State", {states: "", error: error});
                }
                res.json({cities: result, stauts: true});
            })
        } else{
            res.render("./task14/City_State", {states: "", error: "Somehting Went Wrong"});
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {renderCityStateView, generateCities};