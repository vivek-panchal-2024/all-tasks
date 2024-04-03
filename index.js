const express = require("express");
var path = require("path");
const routes = require("./routes/routes");
const cookieParser = require('cookie-parser');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname + "/views")));
app.use('/', routes);
app.set('view engine', 'ejs');

app.listen(PORT, (error) => {
    if (!error){
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    }
    else{
        console.log("Error occurred, server can't start", error);
    }
});