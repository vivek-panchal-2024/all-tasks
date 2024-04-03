const db = require("../db");

const renderGenerateCompView = (req, res)=>{
    if(db.connection){
        res.render("./task13/generateComp", {result: "", error: ""});
    } else{
        res.send("Something Went Wrong.");
    }
}

const generateComp= (req, res)=>{
    if(db.connection){
        let input = req.body.inputVaue;
        let sql = "";

        if(input){
            sql = `select select_master.id, select_master.Select_Name, select_master.Select_Key, select_master.control_type, select_master.allowed_multiple, option_master.Option_Key from select_master left join option_master on select_master.id = option_master.S_id where select_master.Select_Key = '${input}';`; 
            
            // console.log(sql);
            db.connection.query(sql, (error, result)=>{
                if(error){
                    return res.render("./task13/generateComp", {result: "", error: error});
                }


                if(result.length > 0){
                    res.render("./task13/generateComp", {result, error: ""});
                } else{
                    return res.render("./task13/generateComp", {result: "", error: "No data found"})
                }
            });

        } else{
            return res.render("./task13/generateComp", {result: "", error: "Please Enter the name of the Component"});
        }

    } else{
        res.send("Something Went Wrong.");
    }
}

module.exports = {renderGenerateCompView, generateComp};