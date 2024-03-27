const express = require("express");
const auth = require("./routes/auth");
const cookieParser = require('cookie-parser');
require("dotenv").config();


const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/', auth);
app.set('view engine', 'ejs');

app.listen(PORT, (error) => {
    if (!error){
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    }
    else{
        console.log("Error occurred, server can't start", error);
    }
});