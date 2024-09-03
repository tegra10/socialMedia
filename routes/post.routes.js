const {
  readPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unLikePost,
} = require("../controllers/post.controller");

const router = require("express").Router();

router.get("/", readPost);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/like-post/:id", likePost);
router.patch("/unlike-post/:id", unLikePost);

module.exports = router;
