const {Router} = require('express'); 
var task6 = require("../controllers/task6Controller");
const passport = require("passport");
require("../middleware/passport");
const router = Router(); 

router.get('/student-form', passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task6.renderStudentFormView);

router.post('/add-student', passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task6.addStudent);

router.get('/list-of-all-Student', passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task6.getStudents)

router.get('/get-all-details/:id', passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task6.getStudent)


module.exports = router;