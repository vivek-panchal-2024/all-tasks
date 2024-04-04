const db = require("../db");
let offsetValue = 0;
let lastPageNumber = 1;
let fieldName = "id";
let ordered_type = "asc";
let days = 0;

const getAttendance = (req, res) => {
  let sql = "";

  if (req.query.pg === 1 || req.query.pg === undefined) {
    offsetValue = 0;
  } else {
    offsetValue = req.query.pg * 50 - 50;
  }

  if (db.connection) {
    student_id = req.query.inputStudentId;
    if (req.query.attendance === "1" || req.query.attendance === undefined) {
      if (req.query.fieldName && req.query.ordered_type) {
        fieldName = req.query.fieldName;
        ordered_type = req.query.ordered_type;
      } else {
        fieldName = "id";
        ordered_type = "asc";
      }

      sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "12" AND YEAR(attendance_records_27thFeb.DOA)="2023" group by student_27thFeb.id order by ${fieldName} ${ordered_type} limit ${offsetValue} , 50;
            select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id 
            WHERE attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "12" AND YEAR(attendance_records_27thFeb.DOA)="2023" group by student_27thFeb.id order by student_27thFeb.id; `;

      days = 31;
    } else if (req.query.attendance === "2") {
      if (req.query.fieldName && req.query.ordered_type) {
        fieldName = req.query.fieldName;
        ordered_type = req.query.ordered_type;
      } else {
        fieldName = "id";
        ordered_type = "asc";
      }

      sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "1" AND YEAR(attendance_records_27thFeb.DOA)="2024" group by student_27thFeb.id order by ${fieldName} ${ordered_type} limit ${offsetValue} , 50;
            select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id 
            WHERE attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "1" AND YEAR(attendance_records_27thFeb.DOA)="2024" group by student_27thFeb.id order by student_27thFeb.id; `;
      days = 31;
    } else {
      if (req.query.fieldName && req.query.ordered_type) {
        fieldName = req.query.fieldName;
        ordered_type = req.query.ordered_type;
      } else {
        fieldName = "id";
        ordered_type = "asc";
      }

      sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "2" AND YEAR(attendance_records_27thFeb.DOA)="2024" group by student_27thFeb.id order by ${fieldName} ${ordered_type} limit ${offsetValue} , 50; 
            select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "2" AND YEAR(attendance_records_27thFeb.DOA)="2024" group by student_27thFeb.id order by student_27thFeb.id; `;

      days = 29;
    }

    db.connection.query(sql, [1, 2], (error, result) => {
      if (result[1].length % 50 === 0) {
        lastPageNumber = result[1].length / 50;
      } else {
        lastPageNumber = parseInt(result[1].length / 50 + 1);
      }

      if (req.query.pg && req.query.attendance) {
        res.render("./task8/StudentAttendance", {
          result: result[0],
          days: days,
          attendance: req.query.attendance,
          pg: req.query.pg,
          url: {
            1: req.url.split("?")[0],
            2: "&",
            3: req.url.split(`${req.query.pg}&`)[1],
          },
          lastPageNumber: lastPageNumber,
          fieldName: fieldName,
          type: ordered_type,
        });
      } else if (req.query.pg) {
        res.render("./task8/StudentAttendance", {
          result: result[0],
          days: days,
          attendance: 1,
          pg: req.query.pg,
          url: {
            1: req.url.split("?")[0],
            2: "&",
            3: req.url.split(`${req.query.pg}&`)[1],
          },
          lastPageNumber: lastPageNumber,
          fieldName: fieldName,
          type: ordered_type,
        });
      } else {
        res.render("./task8/StudentAttendance", {
          result: result[0],
          days: days,
          attendance: 1,
          pg: 1,
          url: { 1: req.url.split("?")[0] },
          lastPageNumber: lastPageNumber,
          fieldName: fieldName,
          type: ordered_type,
        });
      }
    });
  } else {
    res.end("Something went wrong");
  }
};

const filterAttendance = (req, res) => {
  let sql = 0;
  let student_id = req.body.inputStudentId;
  let student_name = req.body.studentName;
  let student_present_days = req.body.presentDays;
  let student_percentage = req.body.percentage;
  let student_percentage_lower_limit = 0;
  let student_percentage_upper_limit = 100;

  if (student_id === "") {
    student_id = "0";
  }
  // console.log(student_id);

  //Mapping of Precentage Range value
  if (student_percentage === "1") {
    student_percentage_lower_limit = 75;
    student_percentage_upper_limit = 100;
  } else if (student_percentage === "2") {
    student_percentage_lower_limit = 50;
    student_percentage_upper_limit = 75;
  } else if (student_percentage === "3") {
    student_percentage_lower_limit = 25;
    student_percentage_upper_limit = 50;
  } else if (student_percentage === "4") {
    student_percentage_lower_limit = 0;
    student_percentage_upper_limit = 25;
  }

  if (db.connection) {
    if (req.query.attendance === "1" || req.query.attendance === undefined) {
      days = 31;
      if (student_id) {
        // console.log("1");
        sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE student_27thFeb.id = ${student_id} AND attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "12" AND YEAR(attendance_records_27thFeb.DOA)="2023" group by student_27thFeb.id;`;
      } else {
        if (
          student_name &&
          student_present_days &&
          student_percentage &&
          student_percentage !== "0"
        ) {
          // console.log("2");
          sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days, round((COUNT(attendance_records_27thFeb.Attendance)*100)/${days}, 2) as percentage from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE student_27thFeb.FirstName LIKE '%${student_name}%' AND attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "12" AND YEAR(attendance_records_27thFeb.DOA)="2023" group by student_27thFeb.id having present_days = ${student_present_days} AND percentage between ${student_percentage_lower_limit} AND ${student_percentage_upper_limit}`;
        } else if (student_name) {
          // console.log("3");
          sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE student_27thFeb.FirstName LIKE '%${student_name}%' AND attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "12" AND YEAR(attendance_records_27thFeb.DOA)="2023" group by student_27thFeb.id`;
        } else if (student_present_days) {
          // console.log("4");
          sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "12" AND YEAR(attendance_records_27thFeb.DOA)="2023" group by student_27thFeb.id having present_days = ${student_present_days};`;
        } else if (student_percentage && student_percentage !== "0") {
          // console.log("5");
          sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days, round((COUNT(attendance_records_27thFeb.Attendance)*100)/${days}, 2) as percentage from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "12" AND YEAR(attendance_records_27thFeb.DOA)="2023" group by student_27thFeb.id having percentage between ${student_percentage_lower_limit} AND ${student_percentage_upper_limit}`;
        }
      }
    } else if (req.query.attendance === "2") {
      days = 31;
      if (student_id) {
        sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE student_27thFeb.id = ${student_id} AND attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "1" AND YEAR(attendance_records_27thFeb.DOA)="2024" group by student_27thFeb.id;`;
      } else {
        if (
          student_name &&
          student_present_days &&
          student_percentage &&
          student_percentage !== "0"
        ) {
          sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days, round((COUNT(attendance_records_27thFeb.Attendance)*100)/${days}, 2) as percentage from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE student_27thFeb.FirstName LIKE '%${student_name}%' AND attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "1" AND YEAR(attendance_records_27thFeb.DOA)="2024" group by student_27thFeb.id having present_days = ${student_present_days} AND percentage between ${student_percentage_lower_limit} AND ${student_percentage_upper_limit};`;
        } else if (student_name) {
          sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE student_27thFeb.FirstName LIKE '%${student_name}%' AND attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "1" AND YEAR(attendance_records_27thFeb.DOA)="2024" group by student_27thFeb.id`;
        } else if (student_present_days) {
          sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "1" AND YEAR(attendance_records_27thFeb.DOA)="2024" group by student_27thFeb.id having present_days = ${student_present_days};`;
        } else if (student_percentage && student_percentage !== "0") {
          sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days, round((COUNT(attendance_records_27thFeb.Attendance)*100)/${days}, 2) as percentage from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "1" AND YEAR(attendance_records_27thFeb.DOA)="2024" group by student_27thFeb.id having percentage between ${student_percentage_lower_limit} AND ${student_percentage_upper_limit}`;
        }
      }
    } else if (req.query.attendance === "3") {
      days = 29;
      if (student_id) {
        sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE student_27thFeb.id = ${student_id} AND attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "2" AND YEAR(attendance_records_27thFeb.DOA)="2024" group by student_27thFeb.id;`;
      } else {
        if (
          student_name &&
          student_present_days &&
          student_percentage &&
          student_percentage !== "0"
        ) {
          sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days, round((COUNT(attendance_records_27thFeb.Attendance)*100)/${days}, 2) as percentage from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE student_27thFeb.FirstName LIKE '%${student_name}%' AND attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "2" AND YEAR(attendance_records_27thFeb.DOA)="2024" group by student_27thFeb.id having present_days = ${student_present_days} AND percentage between ${student_percentage_lower_limit} AND ${student_percentage_upper_limit};`;
        } else if (student_name) {
          sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE student_27thFeb.FirstName LIKE '%${student_name}%' AND attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "2" AND YEAR(attendance_records_27thFeb.DOA)="2024" group by student_27thFeb.id`;
        } else if (student_present_days) {
          sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "2" AND YEAR(attendance_records_27thFeb.DOA)="2024" group by student_27thFeb.id having present_days = ${student_present_days};`;
        } else if (student_percentage && student_percentage !== "0") {
          sql = `select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days, round((COUNT(attendance_records_27thFeb.Attendance)*100)/${days}, 2) as percentage from student_27thFeb LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE attendance_records_27thFeb.Attendance = "P" AND MONTH(attendance_records_27thFeb.DOA) = "2" AND YEAR(attendance_records_27thFeb.DOA)="2024" group by student_27thFeb.id having percentage between ${student_percentage_lower_limit} AND ${student_percentage_upper_limit}`;
        }
      }
    }

    db.connection.query(sql, (error, result) => {
      if (result) {
        res.render("./task8/StudentAttendance", {
          result,
          days: days,
          attendance: req.query.attendance,
          fieldName: "",
          type: "",
          pg: 1,
          url: { 1: req.url.split("?")[0], 2: "&", 3: req.url.split(`&`)[1] },
          lastPageNumber: 1,
        });
      }
    });
  } else {
    res.send("Something Went Wrong.");
  }
};

const getResult = (req, res) => {
  if (req.query.pg === 1 || req.query.pg === undefined) {
    offsetValue = 0;
  } else {
    offsetValue = req.query.pg * 50 - 50;
  }

  let sql = `SELECT student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, SUM(exam_records_27thFeb.OTM) as Theory, SUM(exam_records_27thFeb.OPM) as Practical from student_27thFeb LEFT JOIN exam_records_27thFeb ON student_27thFeb.id = exam_records_27thFeb.Student_id WHERE exam_records_27thFeb.ExamType = "Terminal" group by student_27thFeb.id limit ${offsetValue}, 50; 
    SELECT student_27thFeb.FirstName, student_27thFeb.LastName, SUM(exam_records_27thFeb.OTM) as Theory, SUM(exam_records_27thFeb.OPM) as Practical from student_27thFeb LEFT JOIN exam_records_27thFeb ON student_27thFeb.id = exam_records_27thFeb.Student_id WHERE exam_records_27thFeb.ExamType = "Prelims" group by student_27thFeb.id limit ${offsetValue}, 50; 
    SELECT student_27thFeb.FirstName, student_27thFeb.LastName, SUM(exam_records_27thFeb.OTM) as Theory, SUM(exam_records_27thFeb.OPM) as Practical from student_27thFeb LEFT JOIN exam_records_27thFeb ON student_27thFeb.id = exam_records_27thFeb.Student_id WHERE exam_records_27thFeb.ExamType = "Final" group by student_27thFeb.id limit ${offsetValue}, 50;
    SELECT student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, SUM(exam_records_27thFeb.OTM) as Theory, SUM(exam_records_27thFeb.OPM) as Practical from student_27thFeb LEFT JOIN exam_records_27thFeb ON student_27thFeb.id = exam_records_27thFeb.Student_id WHERE exam_records_27thFeb.ExamType = "Terminal" group by student_27thFeb.id`;

  if (db.connection) {
    db.connection.query(sql, [1, 2, 3, 4], (error, result) => {
      if (result[3].length % 50 === 0) {
        lastPageNumber = result[3].length / 50;
      } else {
        lastPageNumber = parseInt(result[3].length / 50 + 1);
      }

      if (req.query.pg) {
        res.render("./task8/StudentResult", {
          result,
          exam_one: result[0],
          exam_two: result[1],
          exam_three: result[2],
          url: { 1: req.url.split("?")[0] },
          pg: req.query.pg,
          lastPageNumber: lastPageNumber,
        });
      } else {
        res.render("./task8/StudentResult", {
          result,
          exam_one: result[0],
          exam_two: result[1],
          exam_three: result[2],
          url: { 1: req.url },
          pg: 1,
          lastPageNumber: lastPageNumber,
        });
      }
    });
  } else {
    res.send("Something went wrong");
  }
};

const getReportCard = (req, res) => {
  if (db.connection) {
    let student_id = req.query.student || 1;
    let sql = `SELECT student_27thFeb.FirstName, student_27thFeb.LastName, subject_master_27thFeb.id, exam_records_27thFeb.OTM, exam_records_27thFeb.OPM from student_27thFeb LEFT JOIN exam_records_27thFeb ON student_27thFeb.id = exam_records_27thFeb.Student_id  LEFT JOIN subject_master_27thFeb on subject_master_27thFeb.id = exam_records_27thFeb.Subject_id WHERE exam_records_27thFeb.ExamType= "Terminal" AND student_27thFeb.id = ${student_id}; SELECT student_27thFeb.FirstName, student_27thFeb.LastName, subject_master_27thFeb.id, exam_records_27thFeb.OTM, exam_records_27thFeb.OPM from student_27thFeb LEFT JOIN exam_records_27thFeb ON student_27thFeb.id = exam_records_27thFeb.Student_id  LEFT JOIN subject_master_27thFeb on subject_master_27thFeb.id = exam_records_27thFeb.Subject_id WHERE exam_records_27thFeb.ExamType= "Prelims" AND student_27thFeb.id = ${student_id}; SELECT student_27thFeb.FirstName, student_27thFeb.LastName, subject_master_27thFeb.id, exam_records_27thFeb.OTM, exam_records_27thFeb.OPM from student_27thFeb LEFT JOIN exam_records_27thFeb ON student_27thFeb.id = exam_records_27thFeb.Student_id  LEFT JOIN subject_master_27thFeb on subject_master_27thFeb.id = exam_records_27thFeb.Subject_id WHERE exam_records_27thFeb.ExamType= "Final" AND student_27thFeb.id = ${student_id}; select student_27thFeb.id, student_27thFeb.FirstName, student_27thFeb.LastName, COUNT(attendance_records_27thFeb.Attendance) as present_days_of_all_months from student_27thFeb 
        LEFT JOIN attendance_records_27thFeb  ON student_27thFeb.id = attendance_records_27thFeb.student_id WHERE attendance_records_27thFeb.Attendance = "P" AND student_27thFeb.id= ${student_id} group by student_27thFeb.id;`;

    db.connection.query(sql, [1, 2, 3, 4], (error, result) => {
      res.render("./task8/StudentReportCard", {
        exam_one: result[0],
        exam_two: result[1],
        exam_three: result[2],
        attendance: result[3],
      });
    });
  } else {
    res.send("Something went wrong");
  }
};

module.exports = { getAttendance, filterAttendance, getResult, getReportCard };
