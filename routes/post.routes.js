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
const multer = require("multer");

const router = require("express").Router();

// Configuration de Multer pour gérer les téléchargements de fichiers
const storage = multer.memoryStorage(); // Utiliser memoryStorage pour traiter l'image avant de l'enregistrer

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/; // Formats autorisés
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Format incorrect"), false);
  }
};

const upload = multer({ storage, fileFilter });

router.get("/", readPost);
router.post("/", upload.single("file"), createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/like-post/:id", likePost);
router.patch("/unlike-post/:id", unLikePost);
router.patch("/comment-post/:id", commentPost);
router.patch("/edit-comment-post/:id", editCommentPost);
router.patch("/delete-comment-post/:id", deleteCommentPost);

module.exports = router;
