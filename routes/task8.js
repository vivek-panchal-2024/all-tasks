const {Router} = require("express");
const task8 = require("../controllers/studentSystemController");
const passport = require("passport");
require("../middleware/passport");
const router = Router();

router.get('/student-attendance', passport.authenticate('jwt', {session: false, failureRedirect: "/login"}),task8.getAttendance);

router.post('/filter-student-attendance', passport.authenticate('jwt', {session: false, failureRedirect: "/login"}),task8.filterAttendance)

router.get('/student-result', passport.authenticate('jwt', {session: false, failureRedirect: "/login"}),task8.getResult)

router.get('/student-report-card', passport.authenticate('jwt', {session: false, failureRedirect: "/login"}),task8.getReportCard)

module.exports = router;

