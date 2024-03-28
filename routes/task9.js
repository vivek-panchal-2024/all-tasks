const {Router} = require("express");
const task9 = require("../controllers/task9Controller");
const passport = require("passport");
require("../middleware/passport");
const router = Router();


router.get("/student-search", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task9.renderSearchView);

router.post("/student-search", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}),task9.getSearchResult);

module.exports = router;