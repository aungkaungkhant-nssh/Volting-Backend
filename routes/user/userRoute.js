const express = require("express");
const {  fetchCategory } = require("../../controllers/admin/categoryController");
const { userRegister,userLogin, emailVerify } = require("../../controllers/user/userAuthController");
const {fetchVoted,sendVote} = require("../../controllers/user/VotedCotroller");
const { isUserAuth } = require("../../middleware/auth");
const objectId = require("../../middleware/objectId");
const router = express.Router();

router.post("/register",userRegister);
router.post("/login",userLogin);
router.get("/verify/:id/:token",objectId,emailVerify);

router.get("/category",isUserAuth,fetchCategory);
router.get("/voted",isUserAuth,fetchVoted);
router.post("/send-vote",isUserAuth,sendVote)
module.exports = router;