const db = require("../db");

let result = [];
const renderJobApplication = async (req, res) => {  
  try {
    if(req.query.student){
      let id = req.query.student;
      // console.log("id", id);
      let sql = "";

      let values = [id, id, id, id, id, id, id];
      sql = `select * from basic_details where Id = ?; select * from education_details where CandidateId = ?; select * from work_experience where CandidateId = ?; select * from language_records where CandidateId = ?; select * from technologies where CandidateId = ?; select * from reference_contact where CandidateId = ?; select * from preferances where CandidateId = ?;`;
      result = await db.runParameterQuery(sql, values);

      // sql = `select * from education_details where CandidateId = ?`;
      // const educationDetails = await db.runParameterQuery(sql, values);
      // console.log(result[0], result[1], result[2], result[3], result[4], result[5], result[6]);
      if(result[0].length === 0 && result[1].length === 0 && result[2].length === 0 && result[3].length === 0 && result[4].length === 0 && result[5].length === 0 && result[6].length === 0){
        res.render("./task12/JobApplicationForm", {basicDetails: "", educationDetails: "", workExperience: "", language: "", technology: "", reference: "", preferences: "", student: "", error: "No Data Found"});
      } else{
        res.render("./task12/JobApplicationForm", {basicDetails: result[0], educationDetails: result[1], workExperience: result[2], language: result[3], technology: result[4], reference: result[5], preferences: result[6], student: id, error: ""});
      }

    } else{
      res.render("./task12/JobApplicationForm", {basicDetails: "", educationDetails: "", workExperience: "", language: "", technology: "", reference: "", preferences: "", student: "", error: ""});
    }
  } catch (error) {
    console.error(error);
  }
      
};

const postBasicDetails = async (req, res) => {  
    try {
      let basicDeatails = {};
      let rootId = 0;
      let {firstName, lastName, designation, address1, email, address2, phoneNumber, city, gender, state, relationship, zipCode, dob, student } = req.body;
      //console.log(req.body);
      if(student !== undefined){
        values = [firstName, lastName, designation, email, phoneNumber, gender, address1, address2, city, state, zipCode, relationship, dob, student];
        
        sql = `update basic_details SET FirstName = ?, LastName = ?, Designation = ?, Email = ?, PhoneNumber = ?, Gender = ?, Address1 = ?, Address2 = ?, City = ?, State = ?, ZipCode = ?, RelationShipStatus = ?, DOB = ? where Id = ?;`
        
        basicDeatails = await db.runParameterQuery(sql, values);
        //console.log(basicDeatails);
      } else{
        
        let values = [
          [firstName, lastName, designation, email, phoneNumber, gender, address1, address2, city, state, zipCode, relationship, dob]
        ];
        
        // Basic Details query
        sql = "insert into basic_details(FirstName, LastName, Designation, Email, PhoneNumber, Gender, Address1, Address2, City, State, ZipCode, RelationShipStatus, DOB) values ?;"
    
        basicDeatails = await db.runParaQuery(sql, values);
        rootId = basicDeatails.insertId;
        // console.log(basicDeatails);
      }

      if(basicDeatails && rootId){
        res.json({status: true, id: rootId});
      } else if(basicDeatails !== undefined){
        res.json({status: true});
      } else{
        res.json({status: false});
      }

    } catch (error) {
      console.error(error);
    }   
};

const postEducationDetails = async (req, res) => {  
    try {
      let rootId = req.body.id;
      let educationDetails = {};
      let {student} = req.body;
      let educationData = [
        {
          boardName: req.body.boardName,
          passingYear: req.body.passingYear,
          percentage: req.body.percentage,
          courseName: req.body.courseName
        },
        {
          boardName: req.body.boardName2,
          passingYear: req.body.passingYear2,
          percentage: req.body.percentage2,
          courseName: req.body.courseName2
        },
        {
          boardName: req.body.university,
          passingYear: req.body.passingYear3,
          percentage: req.body.percentage3,
          courseName: req.body.courseName3
        },
        {
          boardName: req.body.university2,
          passingYear: req.body.passingYear4,
          percentage: req.body.percentage4,
          courseName: req.body.courseName4
        }
      ];

      if(student !== undefined){
        educationData.filter( education =>{
          return education["boardName"] !== "" && education["passingYear"] !== "" && education["percentage"] !== "" && education["courseName"] !== "";
        }).forEach( async (education) =>{
            let courseIndexofDbRecord = result[1].findIndex( edu =>{
              return edu["CourseName"] === education["courseName"];
            } );
  
            if(courseIndexofDbRecord !== -1){
              sql = `update education_details SET BoardORUniversity = '${education["boardName"]}', PassingYear = '${education["passingYear"]}', Percentage = '${education["percentage"]}', CourseName = '${education["courseName"]}' where CandidateId = '${student}' and CourseName = '${education["courseName"]}'`;   
            } else{
              sql = `insert into education_details(CandidateId, BoardORUniversity, PassingYear, Percentage, CourseName) values(${student},`;    
              for(let detail in education){
                sql += ` '${education[detail]}',`;
              }
              sql = sql.slice(0, -1) + ")";
            }
  
            educationDetails = await db.runQuery(sql);
            // console.log(educationDetails);
        } )
      } else{
        educationData.filter( education =>{
          return education["boardName"] !== "" && education["passingYear"] !== "" && education["percentage"] !== "" && education["courseName"] !== "";
        }).forEach( async (education) =>{
            sql = `insert into education_details(CandidateId, BoardORUniversity, PassingYear, Percentage, CourseName) values(${rootId},`;    
            for(let detail in education){
              sql += ` '${education[detail]}',`;
            }
            sql = sql.slice(0, -1) + ")";
            educationDetails = await db.runQuery(sql);
            // console.log(educationDetails);
        } )
      }     

      if(educationDetails !== undefined){
        res.json({status: true});
      } else{
        res.json({status: false});
      }


    } catch (error) {
      console.error(error);
    }   
};

const postWorkDetails = async (req, res) => {  
  try {
    let {companyName, designation2, startDate, endDate} = req.body;
    let rootId = req.body.id;
    let {student} = req.body;
    let workExperienceDetails = {};
    let deleteWork = {};
    
    //Filter the empty records
    companyName = companyName.filter( company =>{
      return company !== "";
    } );
  
    designation2 = designation2.filter( designation =>{
      return designation !== "";
    } );
  
    startDate = startDate.filter( start =>{
      return start !== "";
    } );

    endDate = endDate.filter( end =>{
      return end !== "";
    } );

    if(student !== undefined){
      sql = `delete from work_experience where CandidateId = '${student}'`; 
      deleteWork = await db.runQuery(sql);
      rootId = student;
      //   console.log(deleteWork);
    } 

    for(let i=0; i<companyName.length; i++){
      sql = `insert into work_experience(CandidateId, CompanyName, Designation, DOJ, DOR) values('${rootId}', '${companyName[i]}', '${[designation2[i]]}', '${startDate[i]}', '${endDate[i]}')`;
      workExperienceDetails = await db.runQuery(sql);
      //console.log(workExperienceDetails);
    }

    if(workExperienceDetails !== undefined){
      res.json({status: true});
    } else if(workExperienceDetails !== undefined &&  deleteWork !== undefined){
      res.json({status: true});
    } else{
      res.json({status: false});
    }

  } catch (error) {
    console.error(error);
  }   
};

const postLanguageDetails = async (req, res) => {  
  try {
    let rootId = req.body.id;
    let {student} = req.body;
    let languageDetails = {};
    let lanaguageData = [
      {
        language: req.body.hindiLanguage,
        read: req.body.hindiRead || "",
        write: req.body.hindiWrite || "",
        speak: req.body.hindiSpeak || ""
      },
      {
        language: req.body.gujaratiLanguage || "",
        read: req.body.gujaratiRead || "",
        write: req.body.gujaratiWrite || "",
        speak: req.body.gujaratiSpeak || ""
      },
      {
        language: req.body.englishLanguage,
        read: req.body.englishRead || "",
        write: req.body.englishWrite || "",
        speak: req.body.englishSpeak || ""
      }
      
    ];

    if(student !== undefined){
      lanaguageData.filter( language =>{
        return language["language"] !== undefined && language["read"] !== undefined && language["speak"] !== undefined && language["write"] !== undefined || language["language"] !== undefined;
      }).forEach( async (language) =>{
        let languageIndexDbRecord = result[3].findIndex( lang =>{
          return lang["LanguageName"] === language["language"];
        });

        if(languageIndexDbRecord !== -1){
          sql = `update language_records SET CandidateId = '${student}', LanguageName = '${language["language"]}', IsRead = '${language["read"]}', IsWrite = '${language["write"]}', IsSpeak = '${language["speak"]}' where CandidateId = '${student}' and LanguageName = '${language["language"]}'`;
        } else{
          sql = `insert into  language_records(CandidateId, LanguageName, IsRead, IsWrite, IsSpeak) values('${student}',`;    
          for(let detail in  language){
            if(detail === "read" || detail === "write" || detail === "speak"){
              if(language[detail] === ""){
                sql += ` NULL,`;
              } else {
                sql += ` '${language[detail]}',`;
              }
            } else{
              sql += ` '${language[detail]}',`;
            }
          }
          sql = sql.slice(0, -1) + ")";
        }
        
        languageDetails = await db.runQuery(sql);
        //console.log(languageDetails);
      } )
    } else{
      lanaguageData.filter( language =>{
        return language["language"] !== undefined && language["read"] !== undefined && language["speak"] !== undefined && language["write"] !== undefined || language["language"] !== undefined;
      }).forEach( async (language) =>{
        sql = `insert into  language_records(CandidateId, LanguageName, IsRead, IsWrite, IsSpeak) values('${rootId}',`;    
        for(let detail in  language){
          if(detail === "read" || detail === "write" || detail === "speak"){
            if(language[detail] === ""){
              sql += ` NULL,`;
            } else {
              sql += ` '${language[detail]}',`;
            }
          } else{
            sql += ` '${language[detail]}',`;
          }
        }
        sql = sql.slice(0, -1) + ")";
        languageDetails = await db.runQuery(sql);
        //console.log(languageDetails);
      } )
    }
    
    if(languageDetails !== undefined){
      res.json({status: true})
    } else{
      res.json({status: false})
    }

  } catch (error) {
    console.error(error);
  }   
};

const postTechnologyDetails = async (req, res) => {  
  try {
    let rootId = req.body.id;
    let technologyDetails = {};
    let {student} = req.body;
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

    if(student !== undefined){
      technologyData.filter( tech =>{
        return tech["technology"] !== undefined && tech["detail"] !== undefined;
        }).forEach( async (tech) =>{
          let techIndexofDbRecord = result[4].findIndex( technology =>{
            return technology["TechnologyName"] === tech["technology"];
          });
  
          
          if(techIndexofDbRecord !== -1){
            sql = `update technologies SET CandidateId = '${student}', TechnologyName = '${tech["technology"]}', Proficiency = '${tech["detail"]}' where CandidateId = '${student}' and TechnologyName = '${tech["technology"]}'`;
          } else{
            sql = `insert into technologies(CandidateId, TechnologyName, Proficiency) values('${student}',`;
            for(let detail in tech){
              sql += ` '${tech[detail]}',`;
            }  
            sql = sql.slice(0, -1) + ")";
          }
          
          technologyDetails = await db.runQuery(sql);
          //console.log(technologyDetails);
        } )
    } else{
      technologyData.filter( tech =>{
        return tech["technology"] !== undefined && tech["detail"] !== undefined;
      }).forEach( async (tech) =>{
        sql = `insert into technologies(CandidateId, TechnologyName, Proficiency) values('${rootId}',`;
        for(let detail in tech){
          sql += ` '${tech[detail]}',`;
        }  
        sql = sql.slice(0, -1) + ")";
        technologyDetails = await db.runQuery(sql);
        //console.log(technologyDetails);
  
        if(technologyDetails !== undefined){
          //console.log("called");
        }
      } );
    }

    if(technologyDetails !== undefined){
      res.json({status: true});
    } else{
      res.json({status: false});
    }   


  } catch (error) {
    console.error(error);
  }   
};

const postReferenceDetails = async (req, res) => {  
  try {
    let rootId = req.body.id;
    let {student} = req.body;
    let deleteReference = {};
    let referenceDetails = {};
    let {referenceName, referenceContactNumber, referenceRelation} = req.body;

    //Filter the empty records
    referenceName = referenceName.filter( name =>{
      return name !== "";
    } );
  
    referenceContactNumber = referenceContactNumber.filter( contact =>{
      return contact !== "";
    })
  
    referenceRelation = referenceRelation.filter( relation =>{
      return relation !== "";
    } )

    if(student !== undefined){
      sql = `delete from reference_contact where CandidateId = '${student}'`; 
      deleteReference = await db.runQuery(sql);
      rootId = student;
      //console.log(deleteReference);
    }
    

    for(let i=0; i<referenceName.length; i++){
      sql = `insert into reference_contact(CandidateId, FullName, ContactNumber, Relation) values('${rootId}', '${referenceName[i]}', '${referenceContactNumber[i]}', '${referenceRelation[i]}')`;
      referenceDetails = await db.runQuery(sql);
      //console.log(referenceDetails);
    }

    if(referenceDetails !== undefined){
      return res.json({status: true});
    } else if(referenceDetails !== undefined &&  deleteReference !== undefined){
      return res.json({status: true});
    } else{
      return res.json({status: false});
    }

  } catch (error) {
    console.error(error);
  }   
};

const postPreferenceDetails = async (req, res) => {  
  try {
    let rootId = req.body.id;
    let {student} = req.body;
    let preferencesDetais = {};  
    let {location, department, noticePeriod, expectedCTC, currentCTC} = req.body;

    //Make it a array if one location is captured.
    if(typeof(location) == "string"){
      location = [location];
    }

    if(student !== undefined){
      location.forEach( async (city) =>{
        let preferenceIndexofDbRecord = result[6].findIndex( pref =>{
          return pref["Location"] === city;
        });

        //console.log(preferenceIndexofDbRecord, "pref");
        
        if(preferenceIndexofDbRecord !== -1){
          if(currentCTC === ""){
            sql = `update preferances SET CandidateId = '${student}', Location = '${city}', NoticePeriod = '${noticePeriod}', ExpectedCTC = '${expectedCTC}', CurrentCTC = null, Department = '${department}' where CandidateId = '${student}' and Location = '${city}'`;
          } else{
            sql = `update preferances SET CandidateId = '${student}', Location = '${city}', NoticePeriod = '${noticePeriod}', ExpectedCTC = '${expectedCTC}', CurrentCTC = '${currentCTC}', Department = '${department}' where CandidateId = '${student}' and Location = '${city}'`;
          }
        } else{
          if(currentCTC !== ""){
            sql = `insert into  preferances(CandidateId, Location, NoticePeriod, ExpectedCTC, CurrentCTC, Department) values('${student}', '${city}', '${noticePeriod}', '${expectedCTC}', '${currentCTC}', '${department}')`;
          } else{
            sql = `insert into  preferances(CandidateId, Location, NoticePeriod, ExpectedCTC, Department) values('${student}', '${city}', '${noticePeriod}', '${expectedCTC}', '${department}')`;
          }
        }
        
        preferencesDetais = await db.runQuery(sql);
        //console.log(preferencesDetais);
      } );

    } else{
      location.forEach( async (city) =>{
        if(currentCTC !== ""){
          sql = `insert into  preferances(CandidateId, Location, NoticePeriod, ExpectedCTC, CurrentCTC, Department) values('${rootId}', '${city}', '${noticePeriod}', '${expectedCTC}', '${currentCTC}', '${department}')`;
        } else{
          sql = `insert into  preferances(CandidateId, Location, NoticePeriod, ExpectedCTC, Department) values('${rootId}', '${city}', '${noticePeriod}', '${expectedCTC}', '${department}')`;
        }
        preferencesDetais = await db.runQuery(sql);
        //console.log(preferencesDetais);
      } );
    }

    if(preferencesDetais !== undefined){
      res.json({status: true});
    } else{
      res.json({status: false});
    }

  } catch (error) {
    console.error(error);
  }   
};




module.exports = {renderJobApplication, postBasicDetails, postEducationDetails, postWorkDetails, postLanguageDetails, postTechnologyDetails, postReferenceDetails, postPreferenceDetails};