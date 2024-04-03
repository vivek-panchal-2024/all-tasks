const {Router} = require("express");
const task12 = require("../controllers/jobApplicationFormAjaxController");
const passport = require("passport");
require("../middleware/passport");
const router = Router();

router.get("/job-application", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task12.renderJobApplication);

router.post("/post-basic-details", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task12.postBasicDetails);
router.post("/post-education-details", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task12.postEducationDetails);
router.post("/post-work-details", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task12.postWorkDetails);
router.post("/post-language-details", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task12.postLanguageDetails);
router.post("/post-technology-details", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task12.postTechnologyDetails);
router.post("/post-reference-details", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task12.postReferenceDetails);
router.post("/post-preference-details", passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), task12.postPreferenceDetails);
module.exports = router;