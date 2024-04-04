var fs = require("fs");
var path = require("path");
const task6Util = require("../utils/task6/task6Util");
const filePath = "../utils/task6/studentData.json";

const renderStudentFormView = (req, res) => {
  res.render("./task6/studentForm");
};

const addStudent = (req, res) => {
  try {
    let userData = [];
    let id = task6Util.generateId();
    req.body.id = id;
    // console.log(fs.existsSync(path.join(__dirname, filePath)));
    if (fs.existsSync(path.join(__dirname, filePath))) {
      userData = fs.readFileSync(path.join(__dirname, filePath));
      userData = JSON.parse(userData);
      // console.log(userData, "addif");
      userData.forEach((data) => {
        if (data.id == req.body.id) {
          req.body.id = task6Util.generateId();
        }
      });
      userData.push(req.body);
    } else {
      userData.push(req.body);
    }
    fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify(userData));
    res.send("Student has been added!");
  } catch (error) {
    console.error(error);
  }
};

const getStudents = (req, res) => {
  if (!fs.existsSync(path.join(__dirname, filePath))) {
    fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify([]));
  }
  let userData = fs.readFileSync(path.join(__dirname, filePath));
  let formattedData = JSON.parse(userData);
  res.render("./task6/listofStudents", { formattedData: formattedData });
};

const getStudent = (req, res) => {
  try {
    let isStudentExist = false;
    if (!fs.existsSync(path.join(__dirname, filePath))) {
      fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify([]));
    }
    let userData = fs.readFileSync(path.join(__dirname, filePath));
    let formattedData = JSON.parse(userData);
    formattedData.forEach((data) => {
      if (data.id == req.params.id) {
        isStudentExist = true;
        return res.render("./task6/getAllDetails", { data: data });
      }
    });

    if (!isStudentExist) {
      return res.send("Data not found");
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { renderStudentFormView, addStudent, getStudents, getStudent };
