const db = require("../db");
const delimeterObject = {'_': "FirstName", '^': "LastName", '$': "Gender", '}': "ContactNumber", '{': "City", ':': "Department"};

const renderSearchView = (req, res)=>{
    if(db){
        res.render("./task9/StudentSearch", {result: "", fields: "", error: "", query: ""});
    } else{
        res.send("Something Went Wrong");
    }
};

const getSearchResult= (req, res)=>{
    if(db.connection){
        let input = req.body.searchInput;
        // console.log(input);
        let inputObject = {};
        let inputValue = "";
        let delimeter = "";
        let sql = "select * from student_27thFeb where";
        
        for(let i=0; i<=input.length; i++){
            if(delimeterObject.hasOwnProperty(input.charAt(i)) || i === (input.length)){
                if(inputValue !== "" && delimeter !== ""){
                    if(inputObject[delimeterObject[delimeter]]){
                        inputObject[delimeterObject[delimeter]] += ` OR ${delimeterObject[delimeter]} LIKE '%${inputValue}%'`;
                    } else{
                        inputObject[delimeterObject[delimeter]] = `'%${inputValue}%'`;
                    }
                    inputValue = "";
                }

                delimeter = input.charAt(i);
                // console.log(delimeter);
            } else{
                inputValue += input.charAt(i);
            }
        }

        if(Object.keys(inputObject).length === 0){
            return res.render("./task9/StudentSearch", {result: "", fields: "", error: "Please Enter the field value", query: ""});
        } else{
            for(let key in inputObject){
                sql += `(${key} LIKE ${inputObject[key]}) AND `;
            }
            sql = sql.slice(0, sql.length-5) + ";";
        }


        db.connection.query(sql, (error, result, fields)=>{

            if(error){
                return res.render("./task9/StudentSearch", {result: "", fields: "", error: error, query: ""})
            }

            if(result){
                res.render("./task9/StudentSearch", {result, fields, error: "", query: input});
            } 
        })

    } else{
        res.send("Something Went Wrong");
    }
}

module.exports = {renderSearchView, getSearchResult};