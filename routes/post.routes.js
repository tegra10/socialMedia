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
const path = require("path");
const sharp = require("sharp"); // Assurez-vous d'installer sharp via npm
const postModel = require("../models/post.model"); // Assurez-vous d'importer votre modèle ici

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
router.post("/", upload.single("file"), async (req, res) => {
  const newPost = new postModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: req.file ? `uploads/posts/${Date.now()}.jpg ` : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    if (req.file) {
      const outputPath = path.join(
        __dirname,
        "../client/public/uploads/posts",
        `${Date.now()}.jpg`
      );

      // Utilisez Sharp pour traiter et enregistrer l'image
      await sharp(req.file.buffer)
        .resize(800, 600)
        .jpeg({ quality: 80 })
        .toFile(outputPath);
    }

    const post = await newPost.save();
    console.log("Post créé avec succès");

    return res.status(201).json(post);
  } catch (err) {
    console.error(err); // Utilisez console.error pour les erreurs
    return res.status(400).send({ error: err.message });
  }
});

router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/like-post/:id", likePost);
router.patch("/unlike-post/:id", unLikePost);
router.patch("/comment-post/:id", commentPost);
router.patch("/edit-comment-post/:id", editCommentPost);
router.patch("/delete-comment-post/:id", deleteCommentPost);

module.exports = router;
