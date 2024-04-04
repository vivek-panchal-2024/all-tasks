const db = require("../db");

let result = [];

const renderJobApplication = async (req, res) => {
  try {
    if (req.query.student) {
      let id = req.query.student;
      // console.log("id", id);
      let sql = "";

      let values = [id, id, id, id, id, id, id];
      sql = `select * from basic_details where Id = ?; select * from education_details where CandidateId = ?; select * from work_experience where CandidateId = ?; select * from language_records where CandidateId = ?; select * from technologies where CandidateId = ?; select * from reference_contact where CandidateId = ?; select * from preferances where CandidateId = ?;`;
      result = await db.runParameterQuery(sql, values);

      if (
        result[0].length === 0 &&
        result[1].length === 0 &&
        result[2].length === 0 &&
        result[3].length === 0 &&
        result[4].length === 0 &&
        result[5].length === 0 &&
        result[6].length === 0
      ) {
        res.render("./task10/JobApplicationForm", {
          basicDetails: "",
          educationDetails: "",
          workExperience: "",
          language: "",
          technology: "",
          reference: "",
          preferences: "",
          student: "",
          error: "No Data Found",
        });
      } else {
        res.render("./task10/JobApplicationForm", {
          basicDetails: result[0],
          educationDetails: result[1],
          workExperience: result[2],
          language: result[3],
          technology: result[4],
          reference: result[5],
          preferences: result[6],
          student: id,
          error: "",
        });
      }
    } else {
      res.render("./task10/JobApplicationForm", {
        basicDetails: "",
        educationDetails: "",
        workExperience: "",
        language: "",
        technology: "",
        reference: "",
        preferences: "",
        student: "",
        error: "",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const postJobApplication = async (req, res) => {
  try {
    let sql = "";
    let values = [];
    let rootId = 0;

    let {
      firstName,
      lastName,
      designation,
      address1,
      email,
      address2,
      phoneNumber,
      city,
      gender,
      state,
      relationship,
      zipCode,
      dob,
      student,
    } = req.body;

    let educationData = [
      {
        boardName: req.body.boardName,
        passingYear: req.body.passingYear,
        percentage: req.body.percentage,
        courseName: req.body.courseName,
      },
      {
        boardName: req.body.boardName2,
        passingYear: req.body.passingYear2,
        percentage: req.body.percentage2,
        courseName: req.body.courseName2,
      },
      {
        boardName: req.body.university,
        passingYear: req.body.passingYear3,
        percentage: req.body.percentage3,
        courseName: req.body.courseName3,
      },
      {
        boardName: req.body.university2,
        passingYear: req.body.passingYear4,
        percentage: req.body.percentage4,
        courseName: req.body.courseName4,
      },
    ];

    let { companyName, designation2, startDate, endDate } = req.body;

    //Filter the empty records
    companyName = companyName.filter((company) => {
      return company !== "";
    });

    designation2 = designation2.filter((designation) => {
      return designation !== "";
    });

    startDate = startDate.filter((start) => {
      return start !== "";
    });

    endDate = endDate.filter((end) => {
      return end !== "";
    });

    let lanaguageData = [
      {
        language: req.body.hindiLanguage,
        read: req.body.hindiRead || "",
        write: req.body.hindiWrite || "",
        speak: req.body.hindiSpeak || "",
      },
      {
        language: req.body.gujaratiLanguage,
        read: req.body.gujaratiRead || "",
        write: req.body.gujaratiWrite || "",
        speak: req.body.gujaratiSpeak || "",
      },
      {
        language: req.body.englishLanguage,
        read: req.body.englishRead || "",
        write: req.body.englishWrite || "",
        speak: req.body.englishSpeak || "",
      },
    ];

    let technologyData = [
      {
        technology: req.body.phpTech,
        detail: req.body.php,
      },
      {
        technology: req.body.mysqlTech,
        detail: req.body.mysql,
      },
      {
        technology: req.body.laravelTech,
        detail: req.body.laravel,
      },
      {
        technology: req.body.oracleTech,
        detail: req.body.oracle,
      },
    ];

    let { referenceName, referenceContactNumber, referenceRelation } = req.body;

    //Filter the empty records
    referenceName = referenceName.filter((name) => {
      return name !== "";
    });

    referenceContactNumber = referenceContactNumber.filter((contact) => {
      return contact !== "";
    });

    referenceRelation = referenceRelation.filter((relation) => {
      return relation !== "";
    });

    let { location, department, noticePeriod, expectedCTC, currentCTC } =
      req.body;

    //Make it a array if one location is captured.
    if (typeof location == "string") {
      location = [location];
    }

    if (student !== "") {
      values = [
        firstName,
        lastName,
        designation,
        email,
        phoneNumber,
        gender,
        address1,
        address2,
        city,
        state,
        zipCode,
        relationship,
        dob,
        student,
      ];

      sql = `update basic_details SET FirstName = ?, LastName = ?, Designation = ?, Email = ?, PhoneNumber = ?, Gender = ?, Address1 = ?, Address2 = ?, City = ?, State = ?, ZipCode = ?, RelationShipStatus = ?, DOB = ? where Id = ?;`;

      const basicDeatails = await db.runParameterQuery(sql, values);
      //   console.log(basicDeatails);

      //Logic to insert or update the education details
      educationData
        .filter((education) => {
          return (
            education["boardName"] !== "" &&
            education["passingYear"] !== "" &&
            education["percentage"] !== "" &&
            education["courseName"] !== ""
          );
        })
        .forEach(async (education) => {
          let courseIndexofDbRecord = result[1].findIndex((edu) => {
            return edu["CourseName"] === education["courseName"];
          });

          if (courseIndexofDbRecord !== -1) {
            sql = `update education_details SET BoardORUniversity = '${education["boardName"]}', PassingYear = '${education["passingYear"]}', Percentage = '${education["percentage"]}', CourseName = '${education["courseName"]}' where CandidateId = '${student}' and CourseName = '${education["courseName"]}'`;
          } else {
            sql = `insert into education_details(CandidateId, BoardORUniversity, PassingYear, Percentage, CourseName) values(${student},`;
            for (let detail in education) {
              sql += ` '${education[detail]}',`;
            }
            sql = sql.slice(0, -1) + ")";
          }

          let educationDetails = await db.runQuery(sql);
          //   console.log(educationDetails);
        });

      //Logic to delete and then insert the work experience
      sql = `delete from work_experience where CandidateId = '${student}'`;
      let deleteWork = await db.runQuery(sql);

      //Logic to insert or update the language details
      lanaguageData
        .filter((language) => {
          return (
            (language["language"] !== undefined &&
              language["read"] !== undefined &&
              language["speak"] !== undefined &&
              language["write"] !== undefined) ||
            language["language"] !== undefined
          );
        })
        .forEach(async (language) => {
          let languageIndexDbRecord = result[3].findIndex((lang) => {
            return lang["LanguageName"] === language["language"];
          });

          if (languageIndexDbRecord !== -1) {
            sql = `update language_records SET CandidateId = '${student}', LanguageName = '${language["language"]}', IsRead = '${language["read"]}', IsWrite = '${language["write"]}', IsSpeak = '${language["speak"]}' where CandidateId = '${student}' and LanguageName = '${language["language"]}'`;
            // console.log(sql);
          } else {
            sql = `insert into  language_records(CandidateId, LanguageName, IsRead, IsWrite, IsSpeak) values('${student}',`;
            for (let detail in language) {
              if (
                detail === "read" ||
                detail === "write" ||
                detail === "speak"
              ) {
                if (language[detail] === "") {
                  sql += ` NULL,`;
                } else {
                  sql += ` '${language[detail]}',`;
                }
              } else {
                sql += ` '${language[detail]}',`;
              }
            }
            sql = sql.slice(0, -1) + ")";
            //   console.log(sql);
          }

          let languageDetails = await db.runQuery(sql);
          // console.log(languageDetails);
        });

      //Logic to update the technology details
      technologyData
        .filter((tech) => {
          return (
            tech["technology"] !== undefined && tech["detail"] !== undefined
          );
        })
        .forEach(async (tech) => {
          let techIndexofDbRecord = result[4].findIndex((technology) => {
            return technology["TechnologyName"] === tech["technology"];
          });

          if (techIndexofDbRecord !== -1) {
            sql = `update technologies SET CandidateId = '${student}', TechnologyName = '${tech["technology"]}', Proficiency = '${tech["detail"]}' where CandidateId = '${student}' and TechnologyName = '${tech["technology"]}'`;
          } else {
            sql = `insert into technologies(CandidateId, TechnologyName, Proficiency) values('${student}',`;
            for (let detail in tech) {
              sql += ` '${tech[detail]}',`;
            }
            sql = sql.slice(0, -1) + ")";
          }

          let technologyDetails = await db.runQuery(sql);
          // console.log(technologyDetails);
        });

      sql = `delete from reference_contact where CandidateId = '${student}'`;
      let deleteReference = await db.runQuery(sql);
      //   console.log(deleteReference);

      location.forEach(async (city) => {
        let preferenceIndexofDbRecord = result[6].findIndex((pref) => {
          return pref["Location"] === city;
        });

        // console.log(preferenceIndexofDbRecord, "pref");

        if (preferenceIndexofDbRecord !== -1) {
          if (currentCTC === "") {
            sql = `update preferances SET CandidateId = '${student}', Location = '${city}', NoticePeriod = '${noticePeriod}', ExpectedCTC = '${expectedCTC}', CurrentCTC = null, Department = '${department}' where CandidateId = '${student}' and Location = '${city}'`;
          } else {
            sql = `update preferances SET CandidateId = '${student}', Location = '${city}', NoticePeriod = '${noticePeriod}', ExpectedCTC = '${expectedCTC}', CurrentCTC = '${currentCTC}', Department = '${department}' where CandidateId = '${student}' and Location = '${city}'`;
          }
        } else {
          if (currentCTC !== "") {
            sql = `insert into  preferances(CandidateId, Location, NoticePeriod, ExpectedCTC, CurrentCTC, Department) values('${student}', '${city}', '${noticePeriod}', '${expectedCTC}', '${currentCTC}', '${department}')`;
          } else {
            sql = `insert into  preferances(CandidateId, Location, NoticePeriod, ExpectedCTC, Department) values('${student}', '${city}', '${noticePeriod}', '${expectedCTC}', '${department}')`;
          }
        }

        let preferencesDetais = await db.runQuery(sql);
        // console.log(preferencesDetais);
      });

      rootId = student;
    } else {
      //Create a Student
      values = [
        [
          firstName,
          lastName,
          designation,
          email,
          phoneNumber,
          gender,
          address1,
          address2,
          city,
          state,
          zipCode,
          relationship,
          dob,
        ],
      ];

      // Basic Details query
      sql =
        "insert into basic_details(FirstName, LastName, Designation, Email, PhoneNumber, Gender, Address1, Address2, City, State, ZipCode, RelationShipStatus, DOB) values ?;";

      const basicDeatails = await db.runParaQuery(sql, values);
      rootId = basicDeatails.insertId;
      //   console.log(rootId);

      //Logic to insert the education details
      educationData
        .filter((education) => {
          return (
            education["university"] !== "" &&
            education["passingYear"] !== "" &&
            education["percentage"] !== "" &&
            education["courseName"] !== ""
          );
        })
        .forEach(async (education) => {
          sql = `insert into education_details(CandidateId, BoardORUniversity, PassingYear, Percentage, CourseName) values(${rootId},`;
          for (let detail in education) {
            sql += ` '${education[detail]}',`;
          }
          sql = sql.slice(0, -1) + ")";
          let educationDetails = await db.runQuery(sql);
          //   console.log(educationDetails);
        });

      //Logic to insert the language details
      lanaguageData
        .filter((language) => {
          return (
            (language["language"] !== undefined &&
              language["read"] !== undefined &&
              language["speak"] !== undefined &&
              language["write"] !== undefined) ||
            language["language"] !== undefined
          );
        })
        .forEach(async (language) => {
          sql = `insert into  language_records(CandidateId, LanguageName, IsRead, IsWrite, IsSpeak) values('${rootId}',`;
          for (let detail in language) {
            if (detail === "read" || detail === "write" || detail === "speak") {
              if (language[detail] === "") {
                sql += ` NULL,`;
              } else {
                sql += ` '${language[detail]}',`;
              }
            } else {
              sql += ` '${language[detail]}',`;
            }
          }
          sql = sql.slice(0, -1) + ")";
          let languageDetails = await db.runQuery(sql);
          // console.log(languageDetails);
        });

      //Logic to add the technology details
      technologyData
        .filter((tech) => {
          return (
            tech["technology"] !== undefined && tech["detail"] !== undefined
          );
        })
        .forEach(async (tech) => {
          sql = `insert into technologies(CandidateId, TechnologyName, Proficiency) values('${rootId}',`;
          for (let detail in tech) {
            sql += ` '${tech[detail]}',`;
          }
          sql = sql.slice(0, -1) + ")";
          let technologyDetails = await db.runQuery(sql);
          // console.log(technologyDetails);
        });

      // //Logic to insert the preferences data
      location.forEach(async (city) => {
        if (currentCTC !== "") {
          sql = `insert into  preferances(CandidateId, Location, NoticePeriod, ExpectedCTC, CurrentCTC, Department) values('${rootId}', '${city}', '${noticePeriod}', '${expectedCTC}', '${currentCTC}', '${department}')`;
        } else {
          sql = `insert into  preferances(CandidateId, Location, NoticePeriod, ExpectedCTC, Department) values('${rootId}', '${city}', '${noticePeriod}', '${expectedCTC}', '${department}')`;
        }
        let preferencesDetais = await db.runQuery(sql);
        // console.log(preferencesDetais);
      });
    }

    //Logic to insert the work experience details
    for (let i = 0; i < companyName.length; i++) {
      sql = `insert into work_experience(CandidateId, CompanyName, Designation, DOJ, DOR) values('${rootId}', '${
        companyName[i]
      }', '${[designation2[i]]}', '${startDate[i]}', '${endDate[i]}')`;
      let workExperienceDetails = await db.runQuery(sql);
      //   console.log(workExperienceDetails);
    }

    // Logic to add the Reference Details
    for (let i = 0; i < referenceName.length; i++) {
      sql = `insert into reference_contact(CandidateId, FullName, ContactNumber, Relation) values('${rootId}', '${referenceName[i]}', '${referenceContactNumber[i]}', '${referenceRelation[i]}')`;
      let referenceDetails = await db.runQuery(sql);
      //   console.log(referenceDetails);
    }

    res.redirect("/task10/job-application");
  } catch (error) {
    console.error(error);
  }
};

const candidateRecord = async (req, res) => {
  try {
    let sql = `select Id, FirstName, LastName, Designation, Email, PhoneNumber, DOB from basic_details`;

    let result = await db.runQuery(sql);
    console.log(result);

    res.render("./task10/CandidateGrid", { result, count: 0 });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { renderJobApplication, postJobApplication, candidateRecord };
