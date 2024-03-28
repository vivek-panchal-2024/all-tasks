const db = require("../db");
var offsetValue = 0;
var fieldName = "FirstName";
var ordered_type = "asc";
var inputQuery = "";
var lastPageNumber = 1;
var deafaultLimit = 50;

const getStudents = (req, res)=>{
    let sql = "";
    if(db){
           
        //Logic for Offsetvalue
        if(req.query.pg === 1 || req.query.pg === undefined){
            offsetValue = 0;
        } else{
            offsetValue = (req.query.pg*200)-200;
        }

        //Logic of SQL Query
        if(req.query.fieldName && req.query.ordered_type ){
            fieldName = req.query.fieldName;
            ordered_type = req.query.ordered_type;
            sql = "select FirstName, LastName, Gender, DOB, ContactNumber, College_Name, Department, City, State, Hobby from student_26thFeb ORDER BY " + fieldName + " " + ordered_type + ` limit 200 OFFSET  ${offsetValue}`;
        } else if (req.query.pg && req.query.fieldName == "" || req.query.ordered_type == ""){
            fieldName = "FirstName";
            ordered_type = "asc";
            sql = "select FirstName, LastName, Gender, DOB, ContactNumber, College_Name, Department, City, State, Hobby from student_26thFeb ORDER BY " + fieldName + " " + ordered_type + ` limit 200 OFFSET  ${offsetValue}`;
        } else{
            sql = `select FirstName, LastName, Gender, DOB, ContactNumber, College_Name, Department, City, State, Hobby from student_26thFeb limit 200 OFFSET  ${offsetValue}`;
        }
        
        db.connection.query(sql, (error, result) =>{
            if(error) throw error;

            if(req.query.pg && req.query.fieldName && req.query.ordered_type){
                res.render("./task7/StudentRecord", {result, number: `${offsetValue+1}`, pg:req.query.pg, order:1, field: fieldName, type: ordered_type});
            } else if (req.query.pg && req.query.fieldName == "" || req.query.ordered_type == ""){
                res.render("./task7/StudentRecord", {result, number: `${offsetValue+1}`, pg:req.query.pg, order:1, field: fieldName, type: ordered_type});
            } else if(req.query.pg){
                res.render("./task7/StudentRecord", {result, number: `${offsetValue+1}`, pg:req.query.pg, order:0, field: "", type: ""});
            } else{
                res.render("./task7/StudentRecord", {result, number: `${offsetValue+1}`, pg:1, order:0, field: "", type: ""});
            }

        })

    } else{
        res.send("Something Went Wrong..");
    }
}

const renderPaginationView =(req, res)=>{
    res.render("./task7/Pagination");
}

const generateGrid = (req, res) =>{
    try {
        if(inputQuery != "" && inputQuery.split('limit')[1] === undefined){

            //Logic to set the offset value for non limit query
           if(req.query.pg === 1 || req.query.pg === undefined){
               offsetValue = 0;
           } else{
               offsetValue = (req.query.pg*50)-50;
           }

           let formattedQuery = `${inputQuery.split(';')[0]} limit ${offsetValue}, 50;` + inputQuery ;

           db.connection.query(formattedQuery, [1, 2] , (error, result, fields)=>{

               if(error){
                   return res.render("./task7/DynamicGrid", {result: "", fields: "", query: "", pg:0, url: {1: req.url.split("?")[0]}, lastPageNumber: 0, error: error});
               }

               if(result[1].length % 50 === 0){
                   lastPageNumber = (result[1].length/50);
               } else{
                   lastPageNumber = parseInt((result[1].length/50) + 1);    
               }

               if(req.query.pg){
                   res.render("./task7/DynamicGrid", {result: result[0], fields: fields[0], query: inputQuery, pg: req.query.pg, lastPageNumber: lastPageNumber, url: {1: req.url.split("?")[0]}, error: ""});
               } else {
                   res.render("./task7/DynamicGrid", {result: result[0], fields: fields[0], query: inputQuery, pg: 1, lastPageNumber: lastPageNumber, url: {1: req.url.split("?")[0]}, error: ""});
               }

           })
       } else if(inputQuery != "" && inputQuery.split('limit')[1] !== undefined){
           let limit = Number(inputQuery.split(", ")[1].split(";")[0]);
           let offSet = Number(inputQuery.split("limit")[1].split(",")[0]);

            //Logic to set the offset value for limit query
           if(req.query.pg === 1 || req.query.pg === undefined){
               offsetValue = offSet;
           } else{
               offsetValue = (req.query.pg*50)-50+10;
           }

           //Logic to set the lastpageNumber
           if(limit % 50 === 0){
               lastPageNumber = limit/50;
           } else{
               lastPageNumber = parseInt((limit/50) + 1);    
           }


           if(limit > deafaultLimit ){
               var formattedQuery = `${inputQuery.split('limit')[0]} limit ${offsetValue}, ${deafaultLimit};`;
               
           } else{
               formattedQuery = `${inputQuery.split('limit')[0]} limit ${offsetValue}, ${limit};`;
           }


           db.connection.query(formattedQuery, (error, result, fields)=>{
               if(error){
                   res.render("./task7/DynamicGrid", {result: "", fields: "", query: "", pg:0, url: {1: req.url.split("?")[0]}, lastPageNumber: 0, error: error});
               }

               if(req.query.pg){

                   if(req.query.pg > lastPageNumber){
                       inputQuery = "";
                   }

                   res.render("./task7/DynamicGrid", {result, fields, query: inputQuery, pg: req.query.pg, lastPageNumber: lastPageNumber, url: {1: req.url.split("?")[0]}, error: ""});
               } else {
                   res.render("./task7/DynamicGrid", {result, fields, query: inputQuery, pg: 1, lastPageNumber: lastPageNumber, url: {1: req.url.split("?")[0]}, error: ""});
               }
           })

       } else{
           res.render("./task7/DynamicGrid", {result: "", fields: "", query: "", pg:0, url: {1: req.url.split("?")[0]}, lastPageNumber: 0, error: ""});
       }
    } catch (error) {
        console.log(error);
    }
}

const postQuery = (req, res)=>{
    if(req.body){
        inputQuery  = req.body.query;
        res.redirect("/task7/generate-grid");
    } else{
        res.send({status: "False", message: "Something Went Wrong."});
    }
}

module.exports = {getStudents, renderPaginationView, generateGrid, postQuery}