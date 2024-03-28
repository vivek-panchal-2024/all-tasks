const {Router} = require("express");
const task7 = require("../controllers/task7Controller");
const passport = require("passport");
require("../middleware/passport");
const router = Router();

router.get("/student-list", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task7.getStudents);

router.get("/pagination-component", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task7.renderPaginationView);

router.get("/generate-grid", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task7.generateGrid);

router.post("/post-query", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task7.postQuery);

module.exports = router;