const express = require("express");
var path = require("path");
const auth = require("./routes/auth");
const task1 = require("./routes/task1");
const task2 = require("./routes/task2");
const task3 = require("./routes/task3");
const task4 = require("./routes/task4");
const task5 = require("./routes/task5");
const task6 = require("./routes/task6");
const cookieParser = require('cookie-parser');
require("dotenv").config();


const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/', auth);
app.use('/task1', task1);
app.use('/task2', task2);
app.use('/task3', task3);
app.use('/task4', task4);
app.use('/task5', task5);
app.use('/task6', task6);
app.use(express.static(path.join(__dirname + "/views")));
app.set('view engine', 'ejs');


app.listen(PORT, (error) => {
    if (!error){
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    }
    else{
        console.log("Error occurred, server can't start", error);
    }
});