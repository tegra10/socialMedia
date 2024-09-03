const {
  readPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unLikePost,
  commentPost,
  editCommentPost,
  deleteCommentPost,
} = require("../controllers/post.controller");

const router = require("express").Router();

router.get("/", readPost);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/like-post/:id", likePost);
router.patch("/unlike-post/:id", unLikePost);
router.patch("/comment-post/:id", commentPost);
router.patch("/edit-comment-post/:id", editCommentPost);
router.patch("/delete-comment-post/:id", deleteCommentPost);

module.exports = router;
