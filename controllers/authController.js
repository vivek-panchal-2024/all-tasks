const db = require("../db");
const random = require('random-string-alphanumeric-generator');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
require("dotenv").config();

const renderRegistrationView = (req, res)=>{
    try {
        res.render("./login/RegisterView");
    } catch (error) {
        console.error(error);
    }
}

const renderLoginView = (req, res)=>{
    try {
        res.render("./login/LoginView");
    } catch (error) {
        console.error(error);
    }
}

const renderResetPasswordView = (req, res)=>{
    try {
        res.render("./login/ResetPwd", {auth_code: "", error: "", successMessage: ""});
    } catch (error) {
        console.error(error);
    }
}

const renderDashboardView = (req, res)=>{
    try {
      res.render("./login/Dashboard", {error: ""});
    } catch (error) {
      console.error(error);
    }
}

const registerUser = async (req, res)=>{
    try {
    //   console.log(req.body);
      let {f_name, l_name, email, pwd} = req.body;
      let sql = `select email from users where email = '${email}'`;
      let isUserExist = await db.runQuery(sql);
    //   console.log(isUserExist);
      if(isUserExist.length > 0){
        return res.render("./login/RegistrationResponse", {auth_code: "", link: "", error: "User Already Exist."});
      } else {
          let salt = random.randomAlphanumeric(4);
          let auth_code = random.randomAlphanumeric(16);
          // console.log(pwd + salt);
          let hash_pwd = CryptoJS.MD5(pwd + salt);
          hash_pwd = hash_pwd.toString(CryptoJS.enc.Base64);
          // console.log(hash_pwd);
    
          let values = [f_name, l_name, email, hash_pwd, salt, auth_code];
          sql = `insert into users(first_name, last_name, email, password, salt, auth_code) values(?, ?, ?, ?, ?, ?)`
          let user = await db.runParameterQuery(sql, values);
          // console.log(user);
    
          res.render("./login/RegistrationResponse", {auth_code, link: `http://localhost:3000/activate-user/${auth_code}`, error: ""});
      }
    } catch (error) {
        console.log(error);
        return res.render("./login/RegistrationResponse", {auth_code: "", link: "", error: "Something Went Wrong"});
    }
}

const loginUser = async (req, res)=>{
    try {
      let {email, pwd}= req.body;
      let sql = `select email, password, salt, activate_status from users where email = '${email}';`;
      let login = await db.runQuery(sql);
      if(login.length === 1){
        pwd = CryptoJS.MD5(pwd + login[0].salt);
        pwd = pwd.toString(CryptoJS.enc.Base64);
        // console.log(pwd);
        if(pwd === login[0].password && login[0].activate_status == '1'){
          let jwtSecretKey = process.env.JWT_SECRET_KEY;
          let payLoad = {
            user:{
              firstName : login[0].first_name,
              lastName: login[0].last_Name,
              email: email
            }
          }
          let token = jwt.sign(payLoad, jwtSecretKey);
          res.cookie('token', token, {httpOnly: true});
          res.redirect("/dashboard");
        } else if(pwd === login[0].password){
          res.render("./login/Dashboard", {error: 'Please activate your account first.'});
        } else{
          res.render("./login/Dashboard", {error: 'Email or Password is wrong.'});
        }
      } else{
        res.render("./login/Dashboard", {error: 'Email or Password is wrong.'});
      }
    } catch (error) {
        console.log(error);
        return res.render("./login/Dashboard", {error: 'Something Went Wrong'});
    }
}

const activateUser = async (req, res)=>{
    try {
    //   console.log(req.params);
      let values = [req.params.code];
      let sql = `select activate_status, created_at from users where auth_code = ?`;
      let isActivate = await db.runParameterQuery(sql, values);
      let currentDate = new Date();
      let createdAt = new Date(isActivate[0].created_at);
      
      if(isActivate[0].activate_status === 1){
        return res.render("./login/ActivateView", {error: "Link is expired.", message: ""});
      } else if(isActivate[0].activate_status === 0 && (currentDate - createdAt)/60000 > 60) {
        // console.log("time expired called");
        sql = `delete from users where auth_code = ?`;
        let deleteUnactivateUser = await db.runParameterQuery(sql, values);
        console.log(deleteUnactivateUser);
        if(deleteUnactivateUser.affectedRows !== 0){
          return res.render("./login/ActivateView", {error: "Link is expired. Now Register again.", message: ""});
        } else {
          return res.render("./login/ActivateView", {error: "Link is expired.", message: ""});
        }
      } else{
        sql = `update users SET activate_status = '1' where auth_code = ? and activate_status = '0'`
        let activate = await db.runParameterQuery(sql, values);
        // console.log(activate.message);
        if(activate.changedRows !== 0){
          return res.render("./login/ActivateView", {error: "", message: "Your account is activated."});
        } else{
          return res.render("./login/ActivateView", {error: "Something Went Wrong", message: ""});
        }
      }
      
    } catch (error) {
      console.error(error);
      return res.render("./login/ActivateView", {error: "Something Went Wrong", message: ""});
    }
}

const resetPassword = async (req, res)=>{
    try {
      let values = [req.params.code, req.body.pwd];
      // console.log(req.body);
      if(req.body.email){
        let sql = `select email, auth_code from users where email = '${req.body.email}'`;
        let getUser = await db.runQuery(sql);
        if(getUser.length === 1){
          return res.render("./login/ResetPwd", {auth_code: getUser[0].auth_code, error: "", successMessage: ""});
        } else {
          return res.render("./login/ResetPwd", {auth_code: "", error: "No data found", successMessage: ""});
        }
      } else {

        let {pwd, authCode} = req.body;
        let sql = `select salt from users where auth_code = '${authCode}'`;
        let getUser = await db.runQuery(sql);

        if(getUser.length === 1){
          let hash_pwd = CryptoJS.MD5(pwd + getUser[0].salt);
          hash_pwd = hash_pwd.toString(CryptoJS.enc.Base64);
          let values = [hash_pwd, authCode] 
          sql = `update users set password = ? where auth_code = ?`;
          let resetPassword = await db.runParameterQuery(sql, values);
          // console.log(resetPassword);
          if(resetPassword.changedRows !== 0 || resetPassword.affectedRows !== 0){
            return res.render("./login/ResetPwd", {auth_code: "", error: "", successMessage: "Updated Password Successfully!"});
          } else{
            return res.render("./login/ResetPwd", {auth_code: "", error: "Something Went Wrong.", successMessage: ""});
          }
        }
        
      }
      
    } catch (error) {
        console.error(error);
        return res.render("./login/ResetPwd", {auth_code: "", error: "Something Went Wrong.", successMessage: ""});
    }
}

module.exports = {renderRegistrationView, registerUser, activateUser, renderLoginView, loginUser, resetPassword, renderResetPasswordView, renderDashboardView};