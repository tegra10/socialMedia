const express = require("express");
const { signUp } = require("../controllers/auth.controller");
const {
  getAllUsers,
  userInfo,
  updateUser,
  deleteUser,
  follow,
  unFollow,
} = require("../controllers/user.controller");
const router = express.Router();

// auth
router.post("/register", signUp);

// user DB

router.get("/", getAllUsers);
router.get("/:id", userInfo);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/follow/:id", follow);
router.patch("/unfollow/:id", unFollow);

module.exports = router;
